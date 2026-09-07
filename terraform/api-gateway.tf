resource "aws_apigatewayv2_api" "interview_ai" {
  name          = "interview-ai-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = var.frontend_origins
    allow_methods = ["GET", "POST", "OPTIONS"]
    allow_headers = ["Content-Type", "Authorization"]
    max_age       = 300
  }
}

resource "aws_apigatewayv2_integration" "create_question" {
  api_id = aws_apigatewayv2_api.interview_ai.id

  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.create_question.invoke_arn
  integration_method = "POST"

  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "get_questions" {
  api_id = aws_apigatewayv2_api.interview_ai.id

  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.get_questions.invoke_arn
  integration_method = "POST"

  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "create_question" {
  api_id = aws_apigatewayv2_api.interview_ai.id

  route_key = "POST /questions"
  target    = "integrations/${aws_apigatewayv2_integration.create_question.id}"

  authorization_type = "NONE"
}

resource "aws_apigatewayv2_route" "get_questions" {
  api_id = aws_apigatewayv2_api.interview_ai.id

  route_key = "GET /questions"
  target    = "integrations/${aws_apigatewayv2_integration.get_questions.id}"

  authorization_type = "NONE"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id = aws_apigatewayv2_api.interview_ai.id

  name        = "$default"
  auto_deploy = true

  default_route_settings {
    throttling_rate_limit  = 5
    throttling_burst_limit = 10
  }
}

resource "aws_lambda_permission" "api_create_question" {
  statement_id  = "AllowApiGatewayCreateQuestion"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.create_question.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.interview_ai.execution_arn}/*/POST/questions"
}

resource "aws_lambda_permission" "api_get_questions" {
  statement_id  = "AllowApiGatewayGetQuestions"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_questions.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.interview_ai.execution_arn}/*/GET/questions"
}