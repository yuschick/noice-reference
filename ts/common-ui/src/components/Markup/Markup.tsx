import { MarkupUtils } from '@noice-com/utils';
import { HTMLAttributes, ReactElement } from 'react';
import { BiLinkExternal } from 'react-icons/bi';
import { Link } from 'react-router-dom';

import { Icon } from '../Icon';
import { VisuallyHidden } from '../VisuallyHidden';

import styles from './Markup.module.css';

interface Props extends HTMLAttributes<HTMLDivElement> {
  content: string;
}

const renderMarkup = (
  nodes: (MarkupUtils.CustomNode | string)[],
): (ReactElement | string)[] =>
  nodes.map<ReactElement | string>((node, i) => {
    if (typeof node === 'string') {
      return node;
    }

    if (node.tag === 'color') {
      return (
        <span
          className={node.attribute ? styles[node.attribute] : undefined}
          key={i}
        >
          {renderMarkup(node.children)}
        </span>
      );
    }

    if (node.tag === 'link') {
      if (!node.attribute) {
        return <>{renderMarkup(node.children)}</>;
      }

      // Inner link
      if (node.attribute.startsWith('/')) {
        return (
          <Link
            className={styles.link}
            key={i}
            to={node.attribute}
          >
            {renderMarkup(node.children)}
          </Link>
        );
      }

      // Outer link
      return (
        <a
          className={styles.link}
          href={node.attribute}
          key={i}
          rel="noopener noreferrer"
          target="_blank"
        >
          <span>{renderMarkup(node.children)}</span>
          <Icon
            icon={BiLinkExternal}
            size={16}
          />
          <VisuallyHidden> Link opens in a new window.</VisuallyHidden>
        </a>
      );
    }

    if (node.tag === 'paragraph') {
      return <p key={i}>{renderMarkup(node.children)}</p>;
    }

    return <>{renderMarkup(node.children)}</>;
  });

/**
 * This expects content to be custom markup, like
 * <paragraph>some text <color="red">also with color</color></paragraph>
 */
export function Markup({ content, ...props }: Props) {
  return <div {...props}>{renderMarkup(MarkupUtils.parseMarkup(content))}</div>;
}
