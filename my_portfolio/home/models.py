from django.db import models
from django.utils.text import slugify
from imagekit.models import ImageSpecField
from imagekit.processors import ResizeToFill

class Technology(models.Model):
    CATEGORY_CHOICES = [
        ('frontend', 'Frontend'),
        ('backend', 'Backend'),
        ('tools', 'Tools'),
    ]
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='backend')
    icon = models.CharField(max_length=100, blank=True, help_text="Devicon class name (e.g. devicon-python-plain)")

    class Meta:
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Project(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    short_description = models.TextField()
    full_description = models.TextField(blank=True)
    project_url = models.URLField(blank=True, verbose_name="Project URL")
    github_url = models.URLField(blank=True, verbose_name="GitHub URL")
    technologies = models.ManyToManyField(Technology, blank=True)
    cover_image = models.ImageField(upload_to='projects/covers/', blank=True)
    cover_thumbnail = ImageSpecField(
        source='cover_image',
        processors=[ResizeToFill(400, 250)],
        format='WEBP',
        options={'quality': 80},
    )
    is_featured = models.BooleanField(default=False, help_text="Show on the homepage featured section")
    is_published = models.BooleanField(default=True, help_text="Only published projects appear on the live site")
    order = models.IntegerField(default=0, help_text="Lower numbers appear first")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']
        verbose_name = 'Project'
        verbose_name_plural = 'Projects'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Certificate(models.Model):
    title = models.CharField(max_length=200)
    issuer = models.CharField(max_length=200)
    date = models.DateField()
    image = models.ImageField(upload_to='certificates/')
    pdf = models.FileField(upload_to='certificates/', blank=True, null=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title


class Experience(models.Model):
    title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    description = models.TextField()
    start_date = models.CharField(max_length=50)
    end_date = models.CharField(max_length=50, blank=True, null=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title


class Education(models.Model):
    institution = models.CharField(max_length=200)
    degree = models.CharField(max_length=200)
    field_of_study = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    start_date = models.CharField(max_length=50)
    end_date = models.CharField(max_length=50, blank=True, null=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.degree} at {self.institution}"


class Resume(models.Model):
    title = models.CharField(max_length=200)
    file = models.FileField(upload_to='resumes/')
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def save(self, *args, **kwargs):
        if self.is_active:
            Resume.objects.filter(is_active=True).exclude(pk=self.pk).update(is_active=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
