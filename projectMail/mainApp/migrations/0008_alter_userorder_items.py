# Generated by Django 4.0.5 on 2022-07-02 04:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mainApp', '0007_alter_userorder_items'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userorder',
            name='items',
            field=models.JSONField(default=[{'brand': 'Ford', 'model': 'Mustang', 'year': 2020}]),
        ),
    ]
