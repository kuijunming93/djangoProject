# Generated by Django 4.0.5 on 2022-07-02 04:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mainApp', '0006_remove_userorder_item_userorder_items'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userorder',
            name='items',
            field=models.JSONField(default=[{'item': '', 'price': 0}]),
        ),
    ]
