output "ec2_public_ip" {
  value       = aws_instance.node_server.public_ip
  description = "Public IP address of the EC2 instance"
}