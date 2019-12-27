import React from 'react';
import renderer from 'react-test-renderer';
import TitledSection from './TitledSection';

describe('TitledSection', () => {

  test('snapshot renders correctly', () => {

    const component = renderer.create(<TitledSection title='test title'><h1>test children</h1></TitledSection>);

    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});