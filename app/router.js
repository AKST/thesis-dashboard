import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('package', { path: '/package' }, function() {
    this.route('show', { path: '/:package' });
  });
});

export default Router;
