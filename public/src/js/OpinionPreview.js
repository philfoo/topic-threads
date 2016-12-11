const React = require('react');
const voteOptions = {
  convincing: {
    key: "convincing",
    label: "Convincing",
    icon: "convincing.png"
  },
  flawed: {
    key: "flawed",
    label: "Flawed",
    icon: "flawed.png"
  },
  savage: {
    key: "savage",
    label: "Savage",
    icon: "savage.png"
  },
  debatable: {
    key: "debatable",
    label: "Debatable",
    icon: "debatable.png"
  },
  intriguing: {
    key: "intriguing",
    label: "Intriguing",
    icon: "intriguing.png"
  },
}

export class OpinionPreview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      optionIndex: -1,
      voteOverlayShown: false
    }
  }

  mouseEnterOption(index) {
    this.setState({
      optionIndex: index
    });
  }

  mouseLeaveOption() {
    this.setState({
      optionIndex: -1
    });
  }

  selectVoteOption(key, event) {
    this.props.selectOpinionVote(key, this.props.info.opinionId)
    this.toggleOverlay(event);
  }

  toggleOverlay(event) {
    event.stopPropagation();
    this.setState({
      voteOverlayShown: !this.state.voteOverlayShown
    });
  }

  renderVoteOptions() {
    let voteOptionElements = [];
    let options = [];
    Object.keys(voteOptions).forEach((key) => {
      if (voteOptions.hasOwnProperty(key)) {
        options.push(voteOptions[key]);
      }
    });

    options.forEach((option, index) => {
      let voteOption = (
        <div
          key={index + "-vote-option"}
          className={
            index == this.state.optionIndex
            ? "opinion-vote-option hovered"
            : "opinion-vote-option"
          }
          onClick={this.selectVoteOption.bind(this, option.key)}
          onMouseEnter={this.mouseEnterOption.bind(this, index)}
          onMouseLeave={this.mouseLeaveOption.bind(this)}>
          <div className="opinion-vote-option-label">
            {option.label}
          </div>
          <img
            className="opinion-vote-option-icon"
            src={'src/assets/vote-icons/' + option.icon}/>
        </div>
      );
      voteOptionElements.push(voteOption);
    });
    return voteOptionElements;
  }

  selectOpinion() {
    if (this.state.voteOverlayShown) {
      return;
    }
    this.props.viewCommentList(this.props.info.opinionId);
  }

  renderVoteCount() {
    const voteCount = this.props.info.voteCount

    if (Object.keys(voteCount).length == 0) {
      return (
        <div
          className="opinion-vote-count"
          onClick={this.toggleOverlay.bind(this)}>
          No reactions.
        </div>
      );
    }

    let sortedVoteCount = [];
    for (let vote in voteCount) {
      if (voteCount.hasOwnProperty(vote) && voteCount[vote] > 0) {
          sortedVoteCount.push([vote, voteCount[vote]]);
      }
    }
    sortedVoteCount.sort((a, b) => {
      return b[1] - a[1];
    });

    let voteElements = [];
    const length = Math.min(3, sortedVoteCount.length);
    let totalVoteCount = 0;
    for(let i = 0; i < sortedVoteCount.length; i++) {
      totalVoteCount += sortedVoteCount[i][1];
    }

    for(let i = 0; i < length; i++) {
      let voteElement = (
        <div
          key={i + "-count-icon"}
          className="opinion-vote-count-icon">
          <img src={"src/assets/vote-icons/" + voteOptions[sortedVoteCount[i][0]].icon}/>
        </div>
      );
      voteElements.push(voteElement);
    }

    const reactionsLabel = totalVoteCount > 1 ? " reactions." : " reaction.";

    return (
      <div
        className="opinion-vote-count"
        onClick={this.toggleOverlay.bind(this)}>
        {voteElements}
        <div className="reaction-count">
          {totalVoteCount + reactionsLabel}
        </div>
      </div>
    );
  }

  renderUserVote() {
    if (this.props.info.userPreviouslyVoted == null) {
      return null;
    } else {
      return (
        <img src={"src/assets/vote-icons/" + voteOptions[this.props.info.userPreviouslyVoted].icon}/>
      );
    }
  }

  render() {
    return (
      <div
        className={
          this.state.voteOverlayShown
          ? "topic-opinion unselectable show-overlay"
          : "topic-opinion unselectable"
        }
        onClick={this.selectOpinion.bind(this)}>
        <div className="user-vote">
          {this.renderUserVote()}
        </div>
        <div className="topic-opinion-info">
          <img
            className="topic-opinion-author-profile-pic"
            src={"src/assets/" + this.props.info.profilePic}/>
          <div className="topic-opinion-metadata">
            <div className="topic-opinion-author-name">
              {this.props.info.author}
            </div>
            <div className="opinion-vote-count-container">
              {this.renderVoteCount()}
            </div>
          </div>
        </div>
        <div style={{
          display: "flex",
          justifyContent: "center",
          width: "100%"
        }}>
          <div className="topic-opinion-preview-container">
            <div className="topic-opinion-preview">
              {this.props.info.body}
              <div className="preview-fade"/>
            </div>
          </div>
        </div>
        <div
          className="topic-opinion-vote-overlay"
          onClick={this.toggleOverlay.bind(this)}>
          <div className="opinion-vote-container">
            {this.renderVoteOptions()}
          </div>
        </div>
      </div>
    );
  }
}

module.exports = OpinionPreview;