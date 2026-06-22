from django.contrib import admin
from django.utils.html import format_html
from .models import Certificate, Experience

@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ['order', 'title', 'issuer', 'date', 'thumbnail']
    list_editable = ['order']
    list_display_links = ['title']
    search_fields = ['title', 'issuer']
    list_filter = ['issuer', 'date']
    ordering = ['order']

    def thumbnail(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="80" height="60" style="object-fit:cover; border-radius:4px;" />', obj.image.url)
        return ""
    thumbnail.short_description = 'Preview'


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ['order', 'title', 'company', 'start_date', 'end_date']
    list_editable = ['order']
    list_display_links = ['title']
    search_fields = ['title', 'company']
    ordering = ['order']