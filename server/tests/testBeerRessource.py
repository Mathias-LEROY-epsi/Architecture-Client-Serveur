import unittest
from app.app import *

class BeerResourceTestCase(unittest.TestCase):
    def setUp(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()
            db.create_all()
            brewery = Brewery(name='Test Brewery', location='Test Location')
            db.session.add(brewery)
            db.session.commit()
            beer = Beer(name='Test Beer', style='Test Style', brewery=brewery)
            db.session.add(beer)
            db.session.commit()
            self.client = app.test_client()

    def test_get_all_beers(self):
        client = app.test_client()
        response = client.get('/beers')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json['beers']), 1)
        self.assertEqual(response.json['beers'][0]['name'], 'Test Beer')

    def test_get_beer_by_id(self):
        client = app.test_client()
        response = client.get('/beers/1')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json['name'], 'Test Beer')
        self.assertEqual(response.json['style'], 'Test Style')
        self.assertEqual(response.json['brewery']['name'], 'Test Brewery')
        self.assertEqual(response.json['brewery']['location'], 'Test Location')

    def test_get_beer_by_name(self):
        client = app.test_client()
        response = client.get('/beers?name=Test')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json), 1)
        self.assertEqual(response.json[0]['name'], 'Test Beer')

    def test_create_beer(self):
        client = app.test_client()
        response = client.post('/beers', json={
            'name': 'New Beer',
            'style': 'New Style',
            'brewery_id': 1
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json['name'], 'New Beer')
        self.assertEqual(response.json['style'], 'New Style')
        self.assertEqual(response.json['brewery']['name'], 'Test Brewery')
        self.assertEqual(response.json['brewery']['location'], 'Test Location')

    def test_delete_beer(self):
        client = app.test_client()
        response = client.delete('/beers/1')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json['message'], 'Beer deleted')
        response = client.get('/beers/1')
        self.assertEqual(response.json['message'], 'Beer not found')

if __name__ == '__main__':
    unittest.main()
