from django.urls import re_path
from .views import (
    login,
    register,
    logout,
    check,
    upload,
    files_list,
    download,
    delete_file,
    check_email,
    update_password,
)

# signup,  logout, home

app_name = "securecloud"

urlpatterns = [
    re_path(r"^auth/login$", login, name="login"),
    re_path(r"^register$", register, name="register"),
    re_path(r"^auth/check$", check, name="check"),
    re_path(r"^auth/logout$", logout, name="logout"),
    re_path(r"^upload$", upload, name="upload"),
    re_path(r"^download$", download, name="download"),
    re_path(r"^files_list$", files_list, name="files_list"),
    re_path(r"^delete$", delete_file, name="delete"),
    re_path(r"^check-email$", check_email, name="check_email"),
    re_path(r"^update-password$", update_password, name="update_password"),
    # url(r'^home/$', home, name='home'),
    # url(r'^login/$', login, name='login'),
    # url(r'^logout/$', logout, name='logout'),
    # url(r'^signup/$', signup, name='signup'),
]
