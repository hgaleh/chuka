import { Controller, createApp } from '@galeh/chuka';

class ContactsController extends Controller {
	private intercepted = this.use();

	getContacts = this.intercepted.get('/', (_, res) => {
		res.send({
			name: 'Dario',
			lastName: 'Galeh'
		})
	})
}

const app = createApp({
	routes: [
		{
			path: '/contacts',
			controller: ContactsController
		}
	]
});

app.listen(8080, () => {
	console.log('listenning on http://localhost:8080 !');
})