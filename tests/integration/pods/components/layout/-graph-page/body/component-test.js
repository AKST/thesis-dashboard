import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('layout/-graph-page/body', 'Integration | Component | layout/ graph page/body', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{layout/-graph-page/body}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#layout/-graph-page/body}}
      template block text
    {{/layout/-graph-page/body}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
