const BASE_URL = 'http://localhost:3000/products';

describe('API /products', () => {
  it('should be create a new product', () => {
    const product = {
      id: Math.floor(Math.random() * 100000),
      name: 'Water',
      price: 2.3,
    };

    cy.request('POST', BASE_URL, product).should((createdResponse) => {
      expect(createdResponse.status).to.eq(201); // Created

      expect(createdResponse.headers).to.have.property(
        'location',
        `${BASE_URL}/${product.id}`
      );

      expect(createdResponse.body).to.have.property('id', product.id);
      expect(createdResponse.body).to.have.property('name', product.name);
      expect(createdResponse.body).to.have.property('price', product.price);

      const locationUrl = createdResponse.headers.location;

      cy.request(locationUrl).should((findResponse) => {
        expect(findResponse.status).to.eq(200);

        expect(findResponse.body).to.have.property('id', product.id);
        expect(findResponse.body).to.have.property('name', product.name);
        expect(findResponse.body).to.have.property('price', product.price);
      });
    });
  });
});
