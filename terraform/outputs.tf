output "api_url" {
  description = "Interview AI HTTP API URL"
  value       = aws_apigatewayv2_api.interview_ai.api_endpoint
}