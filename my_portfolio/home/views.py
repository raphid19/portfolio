from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import ContactForm
from .email_service import send_contact_email

def home_view(request):
    form = ContactForm()

    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            try:
                send_contact_email(form.cleaned_data)
                messages.success(request, 'Thank you! Your message has been sent successfully.')
                return redirect('home')
            except Exception:
                messages.error(request, 'Failed to send message. Please try again later.')
                return redirect('home')
        else:
            messages.error(request, 'Please correct the errors below.')
            return redirect('home')

    return render(request, 'home/index.html', {'form': form})
