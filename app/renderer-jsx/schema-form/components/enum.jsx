'use strict';

import React from 'react';
import { SelectField, MenuItem } from 'material-ui';

const utils = require('../utils');

class EnumComponent extends React.Component {
  handleChange(evt, idx, val) {
    const { onChange, path } = this.props;
    onChange(path, val);
  }

  render() {
    const { schema, model, name, path, errors } = this.props;
    let title = schema.title || name;
    const description = utils.wrapDescription(schema.description);
    const items = [];

    if (title !== undefined) {
      title = (<h5 style={{ marginBottom: '2px' }}>{title}</h5>);
    }

    for (const itemData of schema.enum) {
      const item = (<MenuItem primaryText={itemData} value={itemData} />);
      items.push(item);
    }

    return (
      <div>
        {title}
        {description}
        <SelectField name="text" value={model}
                   fullWidth={true} style={{ marginTop: '-2px' }}
                   onChange={this.handleChange.bind(this)} >
         {items}
        </SelectField>
      </div>
    );
  }
}

module.exports = EnumComponent;
