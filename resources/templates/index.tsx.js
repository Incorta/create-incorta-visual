const { camelCase, startCase } = require('lodash');

const visualizationIndexGenerator = ({ directory }) => {
  const pascalCaseName = startCase(camelCase(directory)).replace(/ /g, '');
  return `import React from 'react';
import { ComponentsProps } from '@incorta-org/visual-sdk';
import './styles.less';

const ${pascalCaseName} = (props: ComponentsProps) => {
  console.log(props);
  return (
    <div className="test">
      <h1>Hello Incorta Visual</h1>
    </div>
  );
};

export default ${pascalCaseName};
`;
};

module.exports = visualizationIndexGenerator;
