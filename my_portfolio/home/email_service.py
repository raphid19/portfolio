from django.core.mail import send_mail
from django.conf import settings

def send_contact_email(cleaned_data):
    name = cleaned_data['name']
    email = cleaned_data['email']
    subject = cleaned_data['subject']
    message = cleaned_data['message']

    full_message = f"""
New message from your portfolio website:

From: {name} ({email})
Subject: {subject}

Message:
{message}
"""

    send_mail(
        subject=f'Portfolio Contact: {subject}',
        message=full_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[settings.EMAIL_HOST_USER],
        fail_silently=False,
    )
