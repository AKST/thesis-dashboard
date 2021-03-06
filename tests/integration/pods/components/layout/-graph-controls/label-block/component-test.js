import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('layout/-graph-controls/label-block', 'Integration | Component | layout/ graph controls/label block', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{layout/-graph-controls/label-block}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#layout/-graph-controls/label-block}}
      template block text
    {{/layout/-graph-controls/label-block}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
