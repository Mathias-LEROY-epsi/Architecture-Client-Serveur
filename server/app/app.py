from flask_restful import Resource, Api
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DB_CONNECTION_STRING')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
api = Api(app)


class Brewery(db.Model):
    __tablename__ = 'breweries'
    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    location = Column(String(50))
    beers = relationship('Beer', backref='brewery')

class Beer(db.Model):
    __tablename__ = 'beers'
    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    style = Column(String(50))
    brewery_id = Column(Integer, ForeignKey('breweries.id'))
    orders = relationship('Order', secondary='orders_beers')

class Order(db.Model):
    __tablename__ = 'orders'
    id = Column(Integer, primary_key=True)
    customer_name = Column(String(50))
    date = Column(String(255), default=datetime.utcnow)
    beers = relationship('Beer', secondary='orders_beers')

    def to_dict(self):
        return {
            'id': self.id,
            'customer_name': self.customer_name,
            'date': self.date,
            'beers': [{
                        'id': beer.id,
                        'name': beer.name,
                        'style': beer.style
                    } for beer in self.beers]
        }

orders_beers = db.Table('orders_beers',
    Column('order_id', Integer, ForeignKey('orders.id'), primary_key=True),
    Column('beer_id', Integer, ForeignKey('beers.id'), primary_key=True)
)

class BeerResource(Resource):
    def get(self, beer_id=None):
        page = request.args.get('page', default=1, type=int)
        per_page = 5
        if beer_id:
            beer = Beer.query.get(beer_id)
            if beer:
                return {
                    'id': beer.id,
                    'name': beer.name,
                    'style': beer.style,
                    'brewery': {
                        'id': beer.brewery.id,
                        'name': beer.brewery.name,
                        'location': beer.brewery.location
                    }
                }
            else:
                return {'message': 'Beer not found'}, 404
        elif 'name' in request.args:
            name = request.args['name']
            beers = Beer.query.filter(Beer.name.ilike(f'%{name}%')).all()
            return [{
                'id': beer.id,
                'name': beer.name,
                'style': beer.style,
                'brewery': {
                    'id': beer.brewery.id,
                    'name': beer.brewery.name,
                    'location': beer.brewery.location
                }
            } for beer in beers]
        else:
            beers = Beer.query.order_by(Beer.id).paginate(page=page, per_page=per_page)
            return {
                'beers': [{
                    'id': beer.id,
                    'name': beer.name,
                    'style': beer.style,
                    'brewery': {
                        'id': beer.brewery.id,
                        'name': beer.brewery.name,
                        'location': beer.brewery.location
                    }
                } for beer in beers.items],
                'prev_page': beers.prev_num,
                'next_page': beers.next_num,
                'has_prev': beers.has_prev,
                'has_next': beers.has_next,
                'total_pages': beers.pages
            }

    def post(self):
        name = request.json.get('name')
        style = request.json.get('style')
        brewery_id = request.json.get('brewery_id')
        beer = Beer(name=name, style=style, brewery_id=brewery_id)
        db.session.add(beer)
        db.session.commit()
        return {
            'id': beer.id,
            'name': beer.name,
            'style': beer.style,
            'brewery': {
                'id': beer.brewery.id,
                'name': beer.brewery.name,
                'location': beer.brewery.location
            }
        }, 201

    def put(self, beer_id):
        beer = Beer.query.get(beer_id)
        if beer:
            name = request.json.get('name')
            style = request.json.get('style')
            brewery_id = request.json.get('brewery_id')
            beer.name = name
            beer.style = style
            beer.brewery_id = brewery_id
            db.session.commit()
            return {
                'id': beer.id,
                'name': beer.name,
                'style': beer.style,
                'brewery': {
                    'id': beer.brewery.id,
                    'name': beer.brewery.name,
                    'location': beer.brewery.location
                }
            }
        else:
            return {'message': 'Beer not found'}, 404

    def delete(self, beer_id):
        beer = Beer.query.get(beer_id)
        if beer:
            db.session.delete(beer)
            db.session.commit()
            return {'message': 'Beer deleted'}
        else:
            return {'message': 'Beer not found'}, 404

api.add_resource(BeerResource, '/beers', '/beers/<int:beer_id>')

class BreweryResource(Resource):
    def get(self, brewery_id=None):
        if brewery_id:
            brewery = Brewery.query.get(brewery_id)
            if brewery:
                return {
                    'id': brewery.id,
                    'name': brewery.name,
                    'location': brewery.location,
                    'beers': [{
                        'id': beer.id,
                        'name': beer.name,
                        'style': beer.style
                    } for beer in brewery.beers]
                }
            else:
                return {'message': 'Brewery not found'}, 404
        else:
            breweries = Brewery.query.all()
            return [{
                'id': brewery.id,
                'name': brewery.name,
                'location': brewery.location,
                'beers': [{
                    'id': beer.id,
                    'name': beer.name,
                    'style': beer.style
                } for beer in brewery.beers]
            } for brewery in breweries]

    def post(self):
        name = request.json.get('name')
        location = request.json.get('location')
        brewery = Brewery(name=name, location=location)
        db.session.add(brewery)
        db.session.commit()
        return {
            'id': brewery.id,
            'name': brewery.name,
            'location': brewery.location
        }, 201

    def put(self, brewery_id):
        brewery = Brewery.query.get(brewery_id)
        if brewery:
            name = request.json.get('name')
            location = request.json.get('location')
            brewery.name = name
            brewery.location = location
            db.session.commit()
            return {
                'id': brewery.id,
                'name': brewery.name,
                'location': brewery.location
            }
        else:
            return {'message': 'Brewery not found'}, 404

    def delete(self, brewery_id):
        brewery = Brewery.query.get(brewery_id)
        if brewery:
            db.session.delete(brewery)
            db.session.commit()
            return {'message': 'Brewery deleted'}
        else:
            return {'message': 'Brewery not found'}, 404

api.add_resource(BreweryResource, '/breweries', '/breweries/<int:brewery_id>')

class OrderListResource(Resource):
    def get(self):
        orders = Order.query.all()
        return {'orders': [order.to_dict() for order in orders]}

    def post(self):
        data = request.get_json()
        order = Order(customer_name=data['customer_name'], date=datetime.utcnow())
        for beer_id in data['beer_ids']:
            beer = Beer.query.get(beer_id)
            if beer is None:
                return {'error': f'Beer with id {beer_id} not found'}, 400
            order.beers.append(beer)
        db.session.add(order)
        db.session.commit()
        return {'order': order.to_dict()}

class OrderResource(Resource):
    def get(self, order_id):
        order = Order.query.get(order_id)
        if order is None:
            return {'error': f'Order with id {order_id} not found'}, 404
        return {'order': order.to_dict()}

    def delete(self, order_id):
        order = Order.query.get(order_id)
        if order is None:
            return {'error': f'Order with id {order_id} not found'}, 404
        db.session.delete(order)
        db.session.commit()
        return {'message': f'Order with id {order_id} deleted'}

api.add_resource(OrderListResource, '/orders')
api.add_resource(OrderResource, '/orders/<int:order_id>')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0')
