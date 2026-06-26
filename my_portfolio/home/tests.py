from django.test import TestCase
from django.urls import reverse
from .models import Project, Technology


class ProjectModelTests(TestCase):
    def setUp(self):
        self.tech_python = Technology.objects.create(name="Python")
        self.tech_django = Technology.objects.create(name="Django")

        self.project_a = Project.objects.create(
            title="Alpha",
            short_description="First project",
            is_published=True,
            is_featured=True,
            order=1,
        )
        self.project_b = Project.objects.create(
            title="Beta",
            short_description="Second project",
            is_published=True,
            is_featured=False,
            order=2,
        )
        self.project_c = Project.objects.create(
            title="Gamma",
            short_description="Third project",
            is_published=False,
            is_featured=True,
            order=3,
        )
        self.project_d = Project.objects.create(
            title="Delta",
            short_description="Fourth project",
            is_published=True,
            is_featured=True,
            order=0,
        )

        self.project_a.technologies.add(self.tech_python, self.tech_django)

    def test_featured_published_filter(self):
        qs = Project.objects.filter(is_published=True, is_featured=True).order_by('order')
        self.assertEqual(qs.count(), 2)
        self.assertIn(self.project_a, qs)
        self.assertIn(self.project_d, qs)
        self.assertNotIn(self.project_b, qs)
        self.assertNotIn(self.project_c, qs)

    def test_featured_published_ordering(self):
        qs = Project.objects.filter(is_published=True, is_featured=True).order_by('order')
        self.assertEqual(list(qs.values_list('title', flat=True)), ['Delta', 'Alpha'])

    def test_homepage_contains_featured_projects(self):
        response = self.client.get(reverse('home'))
        self.assertContains(response, 'Alpha')
        self.assertContains(response, 'Delta')
        self.assertNotContains(response, 'Beta')
        self.assertNotContains(response, 'Gamma')

    def test_homepage_empty_fallback(self):
        Project.objects.all().delete()
        response = self.client.get(reverse('home'))
        self.assertContains(response, 'No featured projects yet')

    def test_project_str_method(self):
        self.assertEqual(str(self.project_a), 'Alpha')

    def test_slug_auto_generated(self):
        project = Project.objects.create(title="My Test Project", short_description="Test")
        self.assertEqual(project.slug, 'my-test-project')
