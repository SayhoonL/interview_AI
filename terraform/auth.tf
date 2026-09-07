resource "aws_cognito_user_pool" "interview_ai" {
  name = "interview-ai-users"

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = false
    require_uppercase = true
  }
}

resource "aws_cognito_user_pool_client" "interview_ai" {
  name         = "interview-ai-client"
  user_pool_id = aws_cognito_user_pool.interview_ai.id

  generate_secret = false

  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH"
  ]
}

resource "aws_apigatewayv2_authorizer" "jwt" {
  api_id          = aws_apigatewayv2_api.interview_ai.id
  authorizer_type = "JWT"
  name            = "interview-ai-jwt-authorizer"

  identity_sources = [
    "$request.header.Authorization"
  ]

  jwt_configuration {
    audience = [
      aws_cognito_user_pool_client.interview_ai.id
    ]

    issuer = "https://${aws_cognito_user_pool.interview_ai.endpoint}"
  }
}

output "cognito_user_pool_id" {
  value = aws_cognito_user_pool.interview_ai.id
}

output "cognito_client_id" {
  value = aws_cognito_user_pool_client.interview_ai.id
}