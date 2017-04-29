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

  this.route('script', { path: '/script' }, function() {
    this.route('show', { path: '/:script' });
  });
  this.route('vis', { path: '/visualisation' }, function () {
    this.route('scatter');
    this.route('versions');
  });
});

export default Router;
