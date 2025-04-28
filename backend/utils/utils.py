from rest_framework.exceptions import ValidationError

def errordetail_to_dict(e: ValidationError):
    try:
        if type(e) == ValidationError:
            errors = {}

            for field in e.detail:
                errors[field] = {}

                for key in e.detail[field]:
                    errors[field]['code'] = key.code
                    errors[field]['message'] = str(key)
            return errors
        else:
            raise TypeError('TypeError: errordetail_to_dict takes a ValidationError as an argument')
    except Exception as e:
        print(e)
        return None
