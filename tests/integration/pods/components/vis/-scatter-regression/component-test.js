import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('vis/-scatter-regression', 'Integration | Component | vis/ scatter regression', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{vis/-scatter-regression}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#vis/-scatter-regression}}
      template block text
    {{/vis/-scatter-regression}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
