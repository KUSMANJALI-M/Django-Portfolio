from django.core.mail import send_mail
from django.shortcuts import render
from django.contrib import messages
from app import models
from django.conf import settings


def home(request):
    success = False  # ✅ FIX 1: context variable that {% if success %} checks

    if request.method == "POST":
        name    = request.POST.get('name', '')
        email   = request.POST.get('email', '')
        number  = request.POST.get('phone', '')   # matches name="phone" in the form
        content = request.POST.get('message', '')

        # --- validation ---
        if not (2 < len(name) < 30):
            messages.error(request, 'Name should be between 2 and 30 characters.')
            return render(request, 'home.html', {'success': False})

        if not (5 < len(email) < 50):
            messages.error(request, 'Please enter a valid email address.')
            return render(request, 'home.html', {'success': False})

        # ✅ FIX 2: phone is optional in the HTML (no `required`), so allow
        #    empty string; only validate when something is entered.
        if number and not (10 <= len(number) <= 12):
            messages.error(request, 'Phone number must be 10–12 digits.')
            return render(request, 'home.html', {'success': False})

        # --- save to database ---
        try:
            ins = models.contact(
                name=name,
                email=email,
                number=number,
                content=content
            )
            ins.save()
        except Exception as e:
            print("DB save error:", e)

        # --- send email ---
        try:
            send_mail(
                subject=f"Portfolio Contact: {name}",
                message=(
                    f"Name:    {name}\n"
                    f"Email:   {email}\n"
                    f"Phone:   {number}\n\n"
                    f"Message:\n{content}"
                ),
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[settings.EMAIL_HOST_USER],  # sends to yourself
                fail_silently=False,
            )
            success = True  # ✅ only mark success after email is sent
        # except Exception as e:
        #     print("Email send error:", e)
        #     messages.error(
        #         request,
        #         'Your message was saved but the email could not be sent. '
        #         'Please check the server email configuration.'
        #     )
        except Exception as e:
            print("EMAIL ERROR:", repr(e))
            raise

    return render(request, 'home.html', {'success': success})