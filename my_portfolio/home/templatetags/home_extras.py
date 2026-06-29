from django import template
from django.template.defaultfilters import stringfilter
from django.utils.safestring import mark_safe
from django.utils.html import escape

register = template.Library()


@register.filter
@stringfilter
def split(value, delimiter=","):
    return [item.strip() for item in value.split(delimiter) if item.strip()]


@register.filter
@stringfilter
def format_focus_areas(value):
    items = [item.strip() for item in value.split(",") if item.strip()]
    if not items:
        return ""
    parts = []
    for i, item in enumerate(items):
        label = f'<span class="label">{escape(item)}</span>'
        if len(items) == 1:
            parts.append(f"{label}.")
        elif i == len(items) - 1:
            parts.append(f"and {label}.")
        elif i == len(items) - 2:
            parts.append(f"{label}")
        else:
            parts.append(f"{label},")
    return mark_safe(" ".join(parts))
