resource "aws_db_subnet_group" "aurora" {
  name = "interview-ai-db-subnet-group"

  subnet_ids = [
    aws_subnet.private_a.id,
    aws_subnet.private_b.id
  ]

  tags = {
    Name = "interview-ai-db-subnet-group"
  }
}

resource "aws_security_group" "lambda" {
  name        = "interview-ai-lambda-sg"
  description = "Security group for Interview AI Lambda"
  vpc_id      = aws_vpc.main.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "interview-ai-lambda-sg"
  }
}

resource "aws_security_group" "aurora" {
  name        = "interview-ai-aurora-sg"
  description = "Allow PostgreSQL from Interview AI Lambda"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "PostgreSQL from Lambda"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.lambda.id]
  }

  tags = {
    Name = "interview-ai-aurora-sg"
  }
}