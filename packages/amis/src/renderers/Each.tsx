import React from 'react';
import {Renderer, RendererProps, buildStyle, isPureVariable} from 'amis-core';
import {Schema} from 'amis-core';
import {resolveVariable, resolveVariableAndFilter} from 'amis-core';
import {createObject, getPropValue, isObject} from 'amis-core';
import {BaseSchema, SchemaCollection} from '../Schema';

/**
 * Each 循环功能渲染器。
 * 文档：https://aisuda.bce.baidu.com/amis/zh-CN/components/each
 */
export interface EachSchema extends BaseSchema {
  /**
   * 指定为each展示类型
   */
  type: 'each';

  /**
   * 关联字段名
   */
  name?: string;

  /**
   * 关联字段名 支持数据映射
   */
  source?: string;

  items?: SchemaCollection;

  placeholder?: string;
}

export interface EachProps extends RendererProps {
  name: string;
  items: Schema;
}

export default class Each extends React.Component<EachProps> {
  static propsList: Array<string> = ['name', 'items', 'value'];
  static defaultProps = {
    className: '',
    placeholder: 'placeholder.noData'
  };

  render() {
    const {
      data,
      name,
      className,
      style,
      render,
      items,
      placeholder,
      classnames: cx,
      translate: __
    } = this.props;

    const value = getPropValue(this.props, props =>
      props.source
        ? resolveVariableAndFilter(props.source, props.data, '| raw')
        : undefined
    );

    let arr = isObject(value)
      ? Object.keys(value).map(key => ({
          key: key,
          value: value[key]
        }))
      : Array.isArray(value)
      ? value
      : [];

    // 最大循环次数支持
    const maxLength = isPureVariable(this.props.maxLength)
      ? resolveVariableAndFilter(this.props.maxLength, this.props.data) || 0
      : this.props.maxLength;

    if (Array.isArray(arr) && maxLength >= 1 && arr.length > maxLength) {
      arr = arr.slice(0, maxLength);
    }

    return (
      <div className={cx('Each', className)} style={buildStyle(style, data)}>
        {Array.isArray(arr) && arr.length && items ? (
          arr.map((item: any, index: number) =>
            render(`item/${index}`, items, {
              data: createObject(
                data,
                isObject(item)
                  ? {index, ...item}
                  : {[name]: item, item: item, index}
              ),
              key: index
            })
          )
        ) : (
          <div className={cx('Each-placeholder')}>
            {render('placeholder', __(placeholder))}
          </div>
        )}
      </div>
    );
  }
}

@Renderer({
  type: 'each'
})
export class EachRenderer extends Each {}
