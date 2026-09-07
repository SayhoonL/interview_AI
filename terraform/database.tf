resource "terraform_data" "aurora_express" {
  triggers_replace = {
    cluster_identifier = "interview-ai-cluster"
    region             = "us-east-1"
  }

  # CREATE
  provisioner "local-exec" {
    interpreter = ["/bin/bash", "-c"]

    command = <<-EOT
      set -e

      if ! aws rds describe-db-clusters \
        --db-cluster-identifier interview-ai-cluster \
        --region us-east-1 > /dev/null 2>&1; then

        aws rds create-db-cluster \
          --db-cluster-identifier interview-ai-cluster \
          --engine aurora-postgresql \
          --with-express-configuration \
          --region us-east-1
      fi

      aws rds wait db-cluster-available \
        --db-cluster-identifier interview-ai-cluster \
        --region us-east-1
    EOT
  }

  # DESTROY
  provisioner "local-exec" {
    when        = destroy
    interpreter = ["/bin/bash", "-c"]

    command = <<-EOT
      set -e

      CLUSTER="interview-ai-cluster"
      REGION="us-east-1"

      if aws rds describe-db-clusters \
        --db-cluster-identifier "$CLUSTER" \
        --region "$REGION" > /dev/null 2>&1; then

        INSTANCE_IDS=$(aws rds describe-db-instances \
          --region "$REGION" \
          --query "DBInstances[?DBClusterIdentifier=='$CLUSTER'].DBInstanceIdentifier" \
          --output text)

        for INSTANCE_ID in $INSTANCE_IDS; do
          echo "Deleting Aurora instance: $INSTANCE_ID"

          aws rds delete-db-instance \
            --db-instance-identifier "$INSTANCE_ID" \
            --skip-final-snapshot \
            --delete-automated-backups \
            --region "$REGION"

          aws rds wait db-instance-deleted \
            --db-instance-identifier "$INSTANCE_ID" \
            --region "$REGION"
        done

        echo "Deleting Aurora cluster: $CLUSTER"

        aws rds delete-db-cluster \
          --db-cluster-identifier "$CLUSTER" \
          --skip-final-snapshot \
          --delete-automated-backups \
          --region "$REGION"

        aws rds wait db-cluster-deleted \
          --db-cluster-identifier "$CLUSTER" \
          --region "$REGION"
      fi
    EOT
  }
}