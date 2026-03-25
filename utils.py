import os

def allowed_file(filename):
    allowed_extensions = {"jpg", "jpeg", "png"}
    return "." in filename and filename.rsplit(".", 1)[1].lower() in allowed_extensions


def create_upload_folder(path="uploads"):
    os.makedirs(path, exist_ok=True)