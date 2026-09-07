variable "frontend_origins" {
  description = "Allowed CORS origins for the Interview AI frontend"
  type        = list(string)

  default = [
    "http://localhost:5173",
    "https://sayhoonl.github.io"
  ]
}
