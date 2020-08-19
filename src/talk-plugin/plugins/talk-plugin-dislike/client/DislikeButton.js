import React, { useCallback } from 'react';
import styles from './styles.css';
import { withReaction } from 'plugin-api/beta/client/hocs';
import { t } from 'plugin-api/beta/client/services';
import { Icon } from 'plugin-api/beta/client/components/ui';
import cn from 'classnames';

const plugin = 'talk-plugin-dislike';

class DislikeButton extends React.Component {
  handleClick = () => {
    const {
      postReaction,
      deleteReaction,
      showSignInDialog,
      alreadyReacted,
      user,
    } = this.props;

    // If the current user does not exist, trigger sign in dialog.
    if (!user) {
      showSignInDialog();
      return;
    }

    if (alreadyReacted) {
      deleteReaction();
    } else {
      postReaction();
    }
  };

  render() {
    const { count, alreadyReacted } = this.props;
    return (
      <div className={cn(styles.container, `${plugin}-container`)}>
        <button
          className={cn(
            styles.button,
            { [`${styles.disliked} talk-plugin-dislike-disliked`]: alreadyReacted },
            `${plugin}-button`
          )}
          onClick={this.handleClick}
        >
          <span className={cn(`${plugin}-label`, styles.label)}>
            {t(
              alreadyReacted
                ? 'talk-plugin-dislike.disliked'
                : 'talk-plugin-dislike.dislike'
            )}
          </span>
          <Icon name="thumb_down" className={cn(`${plugin}-icon`, styles.icon)} />
          <span className={`${plugin}-count`}>{count > 0 && count}</span>
        </button>
      </div>
    );
  }
}

export default withReaction('dislike')(DislikeButton);
