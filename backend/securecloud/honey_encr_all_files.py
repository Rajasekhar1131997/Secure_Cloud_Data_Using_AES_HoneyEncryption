import os
import stat
import base64

from cryptography.fernet import Fernet
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

""" Fernet package is similiar to AES 128bit CBC mode used to transfer files online"""

# Global Variables
filename = "files/video/file_MP4.mp4"  # Change to your desired file
count_file = "files/video/count.txt"  # File used as counter
key_file = "files/video/key.key"  # File where key stored as hash
private_file = "files/video/private.txt"  # File where password is stores

""" Required only for text file encryption, (for others place their respective files eg: audios/videos/pdf files)
it contains sweetwords(text which will be replaced in plaintext)"""
honey_file = "files/video/honey.txt"

# Ensures count file exists and is initialized
if not os.path.exists(count_file):
    with open(count_file, "w") as f:
        f.write("0")


def store_count():
    """Increments the incorrect password count."""
    with open(count_file, "r+") as f:
        value = int(f.read())
        f.seek(0)
        f.write(str(value + 1))


def reset_count():
    """After entering wrong passwords for 3 times, resets the incorrect password count and
    gives out honey file/files (pdf, docx, audio and video) to the hacker."""
    with open(count_file, "w") as f:
        f.write("0")


def check_count():
    """Checks the current incorrect password count."""
    with open(count_file, "r") as f:
        return int(f.read())


def key_gen():
    """Generates a key from a password and saves it."""
    password = input("Please enter password: ").encode()
    salt = os.urandom(16)  # Use a secure random salt
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=100000,
        backend=default_backend(),
    )
    key = base64.urlsafe_b64encode(kdf.derive(password))

    with open(key_file, "wb") as file:
        file.write(key)

    with open(private_file, "w") as file:
        file.write(password.decode())

    encrypt_file(filename)


def encrypt_file(filename):
    """Encrypts the image/audio/video/docx/pdf/text file with the generated key."""
    with open(key_file, "rb") as file:
        key = file.read()

    cipher_suite = Fernet(key)

    with open(filename, "rb") as f:
        plaintext = f.read()
        ciphertext = cipher_suite.encrypt(plaintext)

    with open(f"{filename}.encrypted", "wb") as f2:
        f2.write(ciphertext)

    os.remove(filename)  # Remove the original image file


def decrypt(filename):
    """Decrypts the encrypted image/audio/video/docx/pdf/text file."""
    inputfile = f"{filename}.encrypted"
    outputfile = filename
    password = input("Enter password: ").encode()

    with open(key_file, "rb") as file:
        key = file.read()

    with open(private_file, "r") as file1:
        old_password = file1.read().encode()

    count = check_count()

    if password == old_password and count < 10:
        with open(inputfile, "rb") as f:
            data = f.read()

        cipher = Fernet(key)
        newdata = cipher.decrypt(data)

        with open(outputfile, "wb") as f:
            f.write(newdata)

        reset_count()
        os.remove(private_file)
        os.remove(key_file)

    elif password != old_password and count < 3:
        print("That is not the password")
        store_count()

    elif password == old_password and count >= 3:
        with open(honey_file, "r") as f:
            honey_data = f.read()
            with open(outputfile, "w") as f2:
                f2.write(honey_data)

        os.remove(inputfile)
        os.remove(private_file)


def main():
    """Main function to handle user input for encrypting or decrypting."""
    print("Please enter whether you want to e for encrypt or d  for decrypt?")
    inp = input("")

    if inp.lower() == "e":
        key_gen()
    elif inp.lower() == "d":
        decrypt(filename)


if __name__ == "__main__":
    main()
# honey_encr_all_files.py
# Displaying honey_encr_all_files.py.
