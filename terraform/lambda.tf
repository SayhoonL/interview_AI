data "aws_caller_identity" "current" {}

data "aws_rds_cluster" "aurora" {
  cluster_identifier = "interview-ai-cluster"

  depends_on = [
    terraform_data.aurora_express
  ]
}

data "archive_file" "create_question" {
  type        = "zip"
  source_file = "${path.module}/../dist/lambda/createQuestionHandler.js"
  output_path = "${path.module}/createQuestionHandler.zip"
}

data "archive_file" "get_questions" {
  type        = "zip"
  source_file = "${path.module}/../dist/lambda/getQuestionsHandler.js"
  output_path = "${path.module}/getQuestionsHandler.zip"
}

resource "aws_iam_role" "lambda" {
  name = "interview-ai-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [{
      Effect = "Allow"

      Principal = {
        Service = "lambda.amazonaws.com"
      }

      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "lambda_database" {
  name = "interview-ai-lambda-database"
  role = aws_iam_role.lambda.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [{
      Effect = "Allow"

      Action = [
        "rds-db:connect"
      ]

      Resource = [
        "arn:aws:rds-db:us-east-1:${data.aws_caller_identity.current.account_id}:dbuser:${data.aws_rds_cluster.aurora.cluster_resource_id}/interview_app"
      ]
    }]
  })
}

resource "aws_iam_role_policy" "lambda_bedrock" {
  name = "interview-ai-lambda-bedrock"
  role = aws_iam_role.lambda.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [{
      Effect = "Allow"

      Action = [
        "bedrock:InvokeModel"
      ]

      Resource = "*"
    }]
  })
}

resource "aws_lambda_function" "create_question" {
  function_name = "interview-ai-create-question"

  role    = aws_iam_role.lambda.arn
  handler = "createQuestionHandler.handler"
  runtime = "nodejs22.x"

  filename         = data.archive_file.create_question.output_path
  source_code_hash = data.archive_file.create_question.output_base64sha256

  memory_size = 512
  timeout     = 60

  environment {
    variables = {
      DB_HOST             = data.aws_rds_cluster.aurora.endpoint
      DB_PORT             = "5432"
      DB_NAME             = "interview_ai"
      DB_USER             = "interview_app"
      DB_AUTH_MODE        = "iam"
      DB_SSL_VERIFY       = "true"
      NODE_EXTRA_CA_CERTS = "/var/runtime/ca-cert.pem"
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_logs,
    aws_iam_role_policy.lambda_database,
    aws_iam_role_policy.lambda_bedrock
  ]
}

resource "aws_lambda_function" "get_questions" {
  function_name = "interview-ai-get-questions"

  role    = aws_iam_role.lambda.arn
  handler = "getQuestionsHandler.handler"
  runtime = "nodejs22.x"

  filename         = data.archive_file.get_questions.output_path
  source_code_hash = data.archive_file.get_questions.output_base64sha256

  memory_size = 512
  timeout     = 60

  environment {
    variables = {
      DB_HOST             = data.aws_rds_cluster.aurora.endpoint
      DB_PORT             = "5432"
      DB_NAME             = "interview_ai"
      DB_USER             = "interview_app"
      DB_AUTH_MODE        = "iam"
      DB_SSL_VERIFY       = "true"
      NODE_EXTRA_CA_CERTS = "/var/runtime/ca-cert.pem"
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_logs,
    aws_iam_role_policy.lambda_database,
    aws_iam_role_policy.lambda_bedrock
  ]
}