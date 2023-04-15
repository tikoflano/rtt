# Race Time Tracker

## Run Locally

1. Clone the repo
1. Open in VS Code, using Dev Containers
1. Run `python manage.py migrate`
1. Run `python manage.py createsuperuser`
1. Run `python manage.py runserver`(or run the launch.json settings)

## Debug

- Run `Python: Django` from the "Run and Debug" menu

#### Important packages used

- https://github.com/rsinger86/drf-flex-fields
- https://github.com/alanjds/drf-nested-routers
- https://github.com/tfranzel/drf-spectacular
  - `python manage.py spectacular --file schema.yml`
- https://github.com/fanout/django-eventstream

### Frontend

- Go to frontend/
- Run `npm start`
