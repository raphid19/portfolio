from django.shortcuts import render
from .forms import ContactForm
from .email_service import send_contact_email

def home_view(request):
    form = ContactForm()
    success_message = None
    error_message = None

    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            try:
                send_contact_email(form.cleaned_data)
                success_message = 'Thank you! Your message has been sent successfully.'
                form = ContactForm()
            except Exception:
                error_message = 'Failed to send message. Please try again later.'
        else:
            error_message = 'Please correct the errors below.'

    return render(request, 'home/index.html', {
        'form': form,
        'success_message': success_message,
        'error_message': error_message,
    })
