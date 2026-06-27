from django.contrib import admin
from django.utils.html import format_html
from .models import Certificate, Education, Experience, Project, Resume, Technology


@admin.register(Technology)
class TechnologyAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'slug', 'icon']
    list_filter = ['category']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['order', 'title', 'is_featured', 'is_published', 'created_at', 'cover_preview']
    list_editable = ['is_featured', 'is_published', 'order']
    list_display_links = ['title']
    list_filter = ['is_featured', 'is_published', 'created_at', 'technologies']
    search_fields = ['title', 'short_description']
    ordering = ['order', '-created_at']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['created_at', 'updated_at', 'cover_preview']
    filter_horizontal = ['technologies']
    fieldsets = [
        ('Basic Information', {
            'fields': ['title', 'slug', 'short_description', 'full_description'],
        }),
        ('Media', {
            'fields': ['cover_image', 'cover_preview'],
        }),
        ('Links', {
            'fields': ['project_url', 'github_url'],
        }),
        ('Classification', {
            'fields': ['technologies', 'is_featured', 'is_published', 'order'],
        }),
        ('Timestamps', {
            'fields': ['created_at', 'updated_at'],
            'classes': ['collapse'],
        }),
    ]

    def cover_preview(self, obj):
        if obj.cover_image:
            return format_html(
                '<img src="{}" width="120" height="75" style="object-fit:cover; border-radius:4px;" />',
                obj.cover_image.url,
            )
        return "No image"
    cover_preview.short_description = 'Cover Preview'


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
