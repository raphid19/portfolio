from django.contrib import admin
from django.utils.html import format_html
from .models import Certificate, Education, Experience, Resume

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


@admin.register(Education)
class EducationAdmin(admin.ModelAdmin):
    list_display = ['order', 'degree', 'institution', 'start_date', 'end_date']
    list_editable = ['order']
    list_display_links = ['degree']
    search_fields = ['degree', 'institution', 'field_of_study']
    ordering = ['order']


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ['title', 'is_active', 'updated_at', 'file_link']
    list_editable = ['is_active']
    list_display_links = ['title']
    search_fields = ['title']

    def file_link(self, obj):
        if obj.file:
            return format_html('<a href="{}" target="_blank">Download</a>', obj.file.url)
        return "-"
    file_link.short_description = 'File'