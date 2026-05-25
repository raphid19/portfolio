from django import forms

class ContactForm(forms.Form):
    name = forms.CharField(
        max_length=100,
        widget=forms.TextInput(attrs={
            'class': 'w-full px-4 py-3 rounded-lg bg-dark-700 border border-dark-500 text-white placeholder-gray-400 focus:outline-none focus:border-accent-500 transition-colors',
            'placeholder': 'Your Name',
        })
    )
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={
            'class': 'w-full px-4 py-3 rounded-lg bg-dark-700 border border-dark-500 text-white placeholder-gray-400 focus:outline-none focus:border-accent-500 transition-colors',
            'placeholder': 'your@email.com',
        })
    )
    subject = forms.CharField(
        max_length=200,
        widget=forms.TextInput(attrs={
            'class': 'w-full px-4 py-3 rounded-lg bg-dark-700 border border-dark-500 text-white placeholder-gray-400 focus:outline-none focus:border-accent-500 transition-colors',
            'placeholder': 'Subject',
        })
    )
    message = forms.CharField(
        widget=forms.Textarea(attrs={
            'class': 'w-full px-4 py-3 rounded-lg bg-dark-700 border border-dark-500 text-white placeholder-gray-400 focus:outline-none focus:border-accent-500 transition-colors resize-none',
            'placeholder': 'Your Message',
            'rows': 6,
        })
    )
