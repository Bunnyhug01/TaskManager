# Generated by Django 4.1 on 2023-04-23 10:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_task_completionpercentage'),
    ]

    operations = [
        migrations.RenameField(
            model_name='subtask',
            old_name='body',
            new_name='name',
        ),
    ]
