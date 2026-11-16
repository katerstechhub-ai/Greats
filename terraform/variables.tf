variable "aws_region" {
  description = "The AWS region to deploy to"
  type        = string
  default     = "eu-north-1"
}

variable "instance_type" {
  type    = string
  default = "t3.micro"
}

variable "key_name" {
  type        = string
  description = "Name of an existing EC2 key pair"
}