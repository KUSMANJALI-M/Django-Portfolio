# from django.shortcuts import render
# from django.http import HttpResponse
# from django.contrib import messages
# from app import models
# from app.models import contact

# # Create your views here.
# def home(request):
#     return render(request,'home.html')
# def contact(request):
#     if request.method=="POST":
#         print('post')
#         name=request.POST.get('name')
#         email=request.POST.get('email')
#         content=request.POST.get('content')
#         number=request.POST.get('number')
#         print(name,email,number,content)

#         if len(name)>1 and len(name)<30:
#             pass
#         else:
#             messages.error(request,'Length of name should be greater than 2 and less than 30 words')
#             request.render(request,'home.html')
#         if len(email)>1 and len(email)<30:
#             pass
#         else:
#             messages.error(request,'invalid Email try again')
#             return render(request,'home.html')
#         if len(number)>2 and len(number)<13:
#             pass
#         else:
#             messages.error(request,'invalid number try again')
#             return render(request,'home.html')
#         ins=models.contact(name=name,email=email,number=number,content=content)
#         ins.save()
#         messages.success(request,'Thank You for contacting me || your message have been stored')
#         print("ypur message has  been saved to database")
#         print("The request is no pass")

    # return render(request,'home.html')   

from django.core.mail import send_mail
from django.shortcuts import render
from django.contrib import messages
from app import models
from django.conf import settings


def home(request):
    if request.method == "POST":
        # ✅ safer (prevents None error)
        name = request.POST.get('name', '')
        email = request.POST.get('email', '')
        number = request.POST.get('phone', '')
        content = request.POST.get('message', '')

        # ✅ validation
        if not (2 < len(name) < 30):
            messages.error(request, 'Name should be between 2 and 30 characters')
            return render(request, 'home.html')

        if not (5 < len(email) < 50):
            messages.error(request, 'Invalid email')
            return render(request, 'home.html')

        if not (10 <= len(number) <= 12):
            messages.error(request, 'Invalid phone number')
            return render(request, 'home.html')

        # ✅ save to database
        ins = models.contact(
            name=name,
            email=email,
            number=number,
            content=content
        )
        ins.save()

        # ✅ send email
        try:
            send_mail(
                subject="New Contact Message",
                message=f"Name: {name}\nEmail: {email}\nPhone: {number}\nMessage: {content}",
                from_email=settings.EMAIL_HOST_USER,  # better practice (uses settings email)
                recipient_list=["khushimanthale@gmail.com"],  # 👈 replace with your email
            )
        except Exception as e:
            messages.error(request, 'Email not sent. Check configuration.')
            print(e)

        # ✅ success message
        messages.success(request, 'Message sent successfully!')

    return render(request, 'home.html')