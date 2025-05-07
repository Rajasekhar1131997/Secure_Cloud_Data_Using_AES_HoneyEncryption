import json
import sqlite3
import os
import mimetypes
import base64

from datetime import datetime
from django.shortcuts import render, redirect
from django.contrib import auth
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import AuthenticationForm
from django.core import serializers
from django.http import JsonResponse, FileResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from cryptography.fernet import Fernet
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import numpy as np

import random
import nltk
from nltk.corpus import wordnet

# Ensure you have the necessary NLTK data
nltk.download("wordnet")


# Create your views here.

Text_Formats = ["text/plain", "text/html", "text/css", "text/javascript"]
Image_Formats = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/svg+xml",
    "image/webp",
]
Audio_Formats = ["audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4"]
Video_Formats = ["video/mp4", "video/x-msvideo", "video/ogg", "video/webm"]
Doc_Formats = [
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.oasis.opendocument.text",
    "application/vnd.oasis.opendocument.text-template",
    "application/msword-template",
]


@csrf_exempt
def login(request):
    msg = {}
    user_login = json.loads(request.body)
    conn = sqlite3.connect("db.sqlite3")
    cur = conn.cursor()
    try:
        # Connect to the SQLite database

        # Execute a query to fetch all users
        cur.execute(
            """SELECT user_id FROM cloud_user_details WHERE email = ? and password=?""",
            (
                user_login["email"],
                user_login["password"],
            ),
        )

        # Fetch one result
        row = cur.fetchone()

        if row:
            msg = {"userid": row[0]}
            cur.execute(
                """UPDATE cloud_user_details SET login_status = 1 WHERE user_id = ?""",
                (str(msg["userid"])),
            )

            conn.commit()
        else:
            msg = {"error": "User not found."}

    except sqlite3.Error as e:
        print(f"error {e}")
        msg = {"error": "Database Error"}

    finally:
        # Ensure the connection is closed
        if conn:
            conn.close()
    return JsonResponse(msg, safe=False)

@csrf_exempt
def check_email(request):
    if request.method == "POST":
        email = json.loads(request.body).get("email")
        conn = sqlite3.connect("db.sqlite3")
        cur = conn.cursor()
        
        try:
            cur.execute("SELECT COUNT(*) FROM cloud_user_details WHERE email = ?", (email,))
            exists = cur.fetchone()[0] > 0
            return JsonResponse({"exists": exists})
        except sqlite3.Error as e:
            return JsonResponse({"error": str(e)}, status=500)
        finally:
            conn.close()

@csrf_exempt
def update_password(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")
        new_password = data.get("password")
        conn = None  # Initialize conn to None
        
        try:
            conn = sqlite3.connect("db.sqlite3")
            cur = conn.cursor()
            cur.execute(
                "UPDATE cloud_user_details SET password = ? WHERE email = ?",
                (new_password, email)
            )
            conn.commit()
            return JsonResponse({"success": "Password updated successfully"})
        except sqlite3.Error as e:
            return JsonResponse({"error": str(e)}, status=500)
        finally:
            if conn:  # Only close conn if it was initialized
                conn.close()

@csrf_exempt
def check(request):
    msg = {}
    if request.method == "POST":
        print(request.POST)
        user_id = request.POST.get("user_id", None)
        print(user_id)
        conn = sqlite3.connect("db.sqlite3")
        cur = conn.cursor()
        try:
            # Connect to the SQLite database

            # Execute a query to fetch all users
            cur.execute(
                """SELECT login_status FROM cloud_user_details WHERE user_id=?""",
                (str(user_id)),
            )

            # Fetch one result
            row = cur.fetchone()
            if row[0] == 1:
                msg = {"userid": row[0]}
        except sqlite3.Error as e:
            print(f"error {e}")
            msg = {"error": "Database Error"}

        finally:
            # Ensure the connection is closed
            if conn:
                conn.close()

        return JsonResponse(msg, safe=False)


@csrf_exempt
def logout(request):
    msg = {}
    user_login = json.loads(request.body)
    print(user_login)
    conn = sqlite3.connect("db.sqlite3")
    cur = conn.cursor()
    cur.execute(
        """UPDATE cloud_user_details SET login_status = 0 WHERE user_id = ?""",
        (str(user_login["user_id"])),
    )
    conn.commit()
    return JsonResponse(msg, safe=False)


@csrf_exempt
def register(request):
    msg = {}
    new_user = json.loads(request.body)
    conn = sqlite3.connect("db.sqlite3")
    cur = conn.cursor()
    try:
        cur.execute(
            """INSERT INTO cloud_user_details (email, password, mobile,login_status,date_joined)VALUES (?, ?, ?, ?, ?)""",
            (
                new_user["email"],
                new_user["password"],
                new_user["mobile"],
                0,
                datetime.now(),
            ),
        )
        # Commit the transaction
        conn.commit()
        last_id = cur.lastrowid
        if not os.path.exists("C://Users//rajas//Downloads//" + str(last_id)):
            os.makedirs("C://Users//rajas//Downloads//" + str(last_id))
            os.makedirs("C://Users//rajas//Downloads//" + str(last_id) + "/.decoy")
        msg = {"success": "Registration Successfull"}
    except sqlite3.Error as e:
        # Handle any SQLite-related errors
        # print(f"An error occurred: {e.args[0]}")
        if e.args[0] == "UNIQUE constraint failed: cloud_user_details.email":
            msg = {"error": "E-Mail Id already Registered"}
        elif e.args[0] == "UNIQUE constraint failed: cloud_user_details.mobile":
            msg = {"error": "Mobile Number already Registered"}
        else:
            msg = {"error": "Database Error"}
    finally:
        # Ensure the connection is closed, even if an error occurred
        if conn:
            conn.close()

    return JsonResponse(msg, safe=False)


@csrf_exempt
def upload(request):
    if request.method == "POST":
        user_id = request.POST.get("user_id", None)
        phrase = request.POST.get("phrase", None)
        # user_id = json.loads(request.body)["user_id"]
        dir_path = "C://Users//rajas//Downloads//" + str(user_id)
        msg = {}
        status = 0
        if not os.path.exists(dir_path) or user_id is None:
            msg = {"error": "Invalid User"}
            status = 405
        else:
            msg = {}
            uploaded_file = request.FILES["file"]

            # Access file details
            file_name = dir_path + "/" + uploaded_file.name
            file_size = uploaded_file.size
            file_content_type = uploaded_file.content_type

            # For example, you could save the file and then return some information
            with open(file_name, "wb+") as destination:
                for chunk in uploaded_file.chunks():
                    destination.write(chunk)

            salt = os.urandom(16)  # Use a secure random salt
            kdf = PBKDF2HMAC(
                algorithm=hashes.SHA256(),
                length=32,
                salt=salt,
                iterations=100000,
                backend=default_backend(),
            )
            key = base64.urlsafe_b64encode(kdf.derive(phrase.encode()))
            cipher_suite = Fernet(key)

            with open(file_name, "rb") as f:
                plaintext = f.read()
                ciphertext = cipher_suite.encrypt(plaintext)

            with open(f"{file_name}.encrypted", "wb") as f2:
                f2.write(ciphertext)

            os.remove(file_name)  # Remove the original file
            os.rename(
                f"{file_name}.encrypted", file_name
            )  # Rename Encrypted file to original file

            conn = sqlite3.connect("db.sqlite3")
            cur = conn.cursor()
            try:
                cur.execute(
                    """INSERT INTO file_details (name, size, phrase,type,createdon,salt,user_id)VALUES (?, ?, ?, ?, ?, ?, ?)""",
                    (
                        uploaded_file.name,
                        file_size,
                        phrase,
                        file_content_type,
                        datetime.now(),
                        salt,
                        user_id,
                    ),
                )
                # Commit the transaction
                conn.commit()
                msg = {"success": "File uploaded successfully"}
                status = 201

            except sqlite3.Error as e:
                # Handle any SQLite-related errors
                # print(f"An error occurred: {e.args[0]}")
                if e.args[0] == "UNIQUE constraint failed: cloud_user_details.name":
                    msg = {"error": "File Already "}
                else:
                    print(f"{e}")
                    msg = {"error": "Database Error"}
                status = 405
            finally:
                # Ensure the connection is closed, even if an error occurred
                if conn:
                    conn.close()

        return JsonResponse(msg, status=status)
    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def files_list(request):
    if request.method == "POST":
        # user_id = request.POST.get("user_id", None)
        user_id = json.loads(request.body)["user_id"]
        dir_path = "C://Users//rajas//Downloads//" + str(user_id)
        file_details = []
        if not os.path.exists(dir_path) or user_id is None:
            msg = {"error": "Invalid User"}
        else:
            msg = {}
            conn = sqlite3.connect("db.sqlite3")
            cur = conn.cursor()
            try:
                # Connect to the SQLite database

                # Execute a query to fetch all users
                cur.execute(
                    """SELECT name FROM file_details WHERE user_id=?""",
                    [user_id],
                )

                file_list = np.array(cur.fetchall())

                for root, dirs, files in os.walk(dir_path):
                    for file_name in files:
                        if file_name in file_list:
                            file_path = os.path.join(root, file_name)
                            file_info = {
                                "path": file_path,
                                "name": file_name,
                                "size": os.path.getsize(file_path),
                                "last_modified": datetime.fromtimestamp(
                                    os.path.getmtime(file_path)
                                ),
                                "type": mimetypes.guess_type(file_path)[0] or "Unknown",
                            }
                            file_details.append(file_info)
                print(file_details)
                return JsonResponse(file_details, safe=False)
            except sqlite3.Error as e:
                print(f"error {e}")
                msg = {"error": "Database Error"}
                return JsonResponse(msg, status=405)

            finally:
                # Ensure the connection is closed
                if conn:
                    conn.close()

    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def download(request):
    if request.method == "POST":
        # user_id = request.POST.get("user_id", None)
        user_id = json.loads(request.body)["user_id"]
        fileName = json.loads(request.body)["fileName"]
        enteredphrase = json.loads(request.body)["phrase"]
        dir_path = "C://Users//rajas//Downloads//" + str(user_id)
        file_path = dir_path + "/" + fileName
        msg = {}

        if not os.path.isfile(file_path):
            raise Http404("File does not exist")
        else:
            conn = sqlite3.connect("db.sqlite3")
            cur = conn.cursor()
            try:
                # Connect to the SQLite database

                # Execute a query to fetch all users
                cur.execute(
                    """SELECT phrase,salt,type FROM file_details WHERE name=? AND user_id=?""",
                    (fileName, user_id),
                )

                # Fetch one result
                row = cur.fetchone()
                dbphrase = row[0]
                salt = bytes(row[1])
                type = row[2]
                if dbphrase == enteredphrase:
                    # decrypt
                    with open(file_path, "rb") as f:
                        data = f.read()

                    kdf = PBKDF2HMAC(
                        algorithm=hashes.SHA256(),
                        length=32,
                        salt=salt,
                        iterations=100000,
                        backend=default_backend(),
                    )
                    key = base64.urlsafe_b64encode(kdf.derive(enteredphrase.encode()))
                    cipher = Fernet(key)
                    newdata = cipher.decrypt(data)
                    outputfile = file_path + ".dcrypt"
                    with open(outputfile, "wb") as f:
                        f.write(newdata)

                    response = FileResponse(open(outputfile, "rb"))
                    response["Content-Disposition"] = (
                        f'attachment; filename="{os.path.basename(outputfile)}"'
                    )
                    os.remove(outputfile)
                    return response
                else:
                    print("\n\tdecoy\n")
                    # send decoy data
                    mime_type, _ = mimetypes.guess_type(file_path)
                    outputfile = ""
                    if mime_type == "application/pdf":
                        outputfile = dir_path + "/.decoy/pdf_decoy.pdf"
                    elif mime_type in Doc_Formats:
                        outputfile = dir_path + "/.decoy/word_decoy.odt"
                    elif mime_type in Text_Formats:
                        outputfile = dir_path + "/.decoy/text_decoy.txt"
                        with open(outputfile, "w") as f:
                            f.write(generate_honey_message())
                    elif mime_type in Image_Formats:
                        outputfile = dir_path + "/.decoy/image_decoy.jpg"
                    else:
                        outputfile = dir_path + "/.decoy/pdf_decoy.pdf"
                    response = FileResponse(open(outputfile, "rb"))
                    response["Content-Disposition"] = (
                        f'attachment; filename="{fileName}"'
                    )
                    return response

            except sqlite3.Error as e:
                print(f"error {e}")
                msg = {"error": "Database Error"}

            finally:
                # Ensure the connection is closed
                if conn:
                    conn.close()
            return JsonResponse(msg, safe=False)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def delete_file(request):
    if request.method == "POST":
        # user_id = request.POST.get("user_id", None)
        user_id = json.loads(request.body)["user_id"]
        fileName = json.loads(request.body)["fileName"]
        dir_path = "C://Users//rajas//Downloads//" + str(user_id)
        file_path = dir_path + "/" + fileName
        msg = {}
        print("delete_file", file_path, os.path.isfile(file_path))
        if not os.path.isfile(file_path):
            raise Http404("File does not exist")
        else:
            conn = sqlite3.connect("db.sqlite3")
            cur = conn.cursor()
            try:
                # Connect to the SQLite database

                # Execute a query to fetch all users
                cur.execute(
                    """DELETE FROM file_details WHERE name=? AND user_id=?""",
                    (fileName, user_id),
                )

                # Fetch one result
                print(cur.fetchone())
                os.remove(file_path)
                conn.commit()
                msg = {"success": "File Deleted successfully"}

            except sqlite3.Error as e:
                print(f"error {e}")
                msg = {"error": "Database Error"}

            finally:
                # Ensure the connection is closed
                if conn:
                    conn.close()
            return JsonResponse(msg, safe=False)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)


def generate_honey_message():
    # Base messages
    messages = [
        "Oops! That password didn't work. But don't worry, here's something sweet for you!",
        "Keep smiling! You're doing great, just try again!",
        "Wrong password, but here's a fun fact: Did you know honey never spoils?",
        "Don't be discouraged! Every attempt gets you closer to success!",
        "Oops! That didn't match. Remember, every expert was once a beginner!",
    ]

    # Randomly choose a message
    message = random.choice(messages)

    # Enhance the message with synonyms or antonyms using NLTK
    words = message.split()
    enhanced_message = []

    for word in words:
        # Decide randomly whether to use a synonym or antonym
        if random.choice([True, False]):
            # Get synonyms for the word
            synonyms = []
            for syn in wordnet.synsets(word):
                for lemma in syn.lemmas():
                    synonyms.append(lemma.name())

            if synonyms:
                # Choose a random synonym if available
                synonym = random.choice(synonyms).replace("_", " ")
                enhanced_message.append(synonym)
            else:
                enhanced_message.append(word)
        else:
            # Get antonyms for the word
            antonyms = []
            for syn in wordnet.synsets(word):
                for lemma in syn.lemmas():
                    if lemma.antonyms():
                        antonyms.extend(lemma.antonyms())

            if antonyms:
                # Choose a random antonym if available
                antonym = random.choice(antonyms).name().replace("_", " ")
                enhanced_message.append(antonym)
            else:
                enhanced_message.append(word)

    return " ".join(enhanced_message)
