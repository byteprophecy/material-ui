import React, {Component, PropTypes, cloneElement} from 'react';
import IconButton from '../IconButton';
import NavigationMenu from '../svg-icons/navigation/menu';
import Paper from '../Paper';
import propTypes from '../utils/propTypes';
import warning from 'warning';
import AutoComplete from 'material-ui/AutoComplete';

export function getStyles(props, context) {
  const {
    appBar,
    button: {
      iconButtonSize,
    },
    zIndex,
  } = context.muiTheme;

  const flatButtonSize = 36;

  const styles = {
    root: {
      position: 'relative',
      zIndex: zIndex.appBar,
      width: '100%',
      display: 'flex',
      backgroundColor: appBar.color,
      paddingLeft: appBar.padding,
      paddingRight: appBar.padding,
    },
    title: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      margin: 0,
      paddingTop: 0,
      letterSpacing: 0,
      fontSize: 24,
      fontWeight: appBar.titleFontWeight,
      color: appBar.textColor,
      height: appBar.height,
      lineHeight: `${appBar.height}px`,
    },
    mainElement: {
      boxFlex: 1,
      flex: '1',
    },
    iconButtonStyle: {
      marginTop: (appBar.height - iconButtonSize) / 2,
      marginRight: 8,
      marginLeft: -16,
    },
    iconButtonIconStyle: {
      fill: appBar.textColor,
      color: appBar.textColor,
    },
    flatButton: {
      color: appBar.textColor,
      marginTop: (iconButtonSize - flatButtonSize) / 2 + 1,
    },
  };

  return styles;
}

class AppBar extends Component {
  constructor(props) {
  super(props);
  this.state = {clearText : false,showNotification: false };

}
  static muiName = 'AppBar';

  static propTypes = {
    /**
     * Can be used to render a tab inside an app bar for instance.
     */
    children: PropTypes.node,
    /**
     * Applied to the app bar's root element.
     */
    className: PropTypes.string,
    /**
     * The classname of the icon on the left of the app bar.
     * If you are using a stylesheet for your icons, enter the class name for the icon to be used here.
     */
    iconClassNameLeft: PropTypes.string,
    /**
     * Similiar to the iconClassNameLeft prop except that
     * it applies to the icon displayed on the right of the app bar.
     */
    iconClassNameRight: PropTypes.string,
    /**
     * The custom element to be displayed on the left side of the
     * app bar such as an SvgIcon.
     */
    iconElementLeft: PropTypes.element,
    /**
     * Similiar to the iconElementLeft prop except that this element is displayed on the right of the app bar.
     */
    iconElementRight: PropTypes.element,
    /**
     * Override the inline-styles of the element displayed on the left side of the app bar.
     */
    iconStyleLeft: PropTypes.object,
    /**
     * Override the inline-styles of the element displayed on the right side of the app bar.
     */
    iconStyleRight: PropTypes.object,
    /**
     * Callback function for when the left icon is selected via a touch tap.
     *
     * @param {object} event TouchTap event targeting the left `IconButton`.
     */
    onLeftIconButtonTouchTap: PropTypes.func,
    /**
     * Callback function for when the right icon is selected via a touch tap.
     *
     * @param {object} event TouchTap event targeting the right `IconButton`.
     */
    onRightIconButtonTouchTap: PropTypes.func,
    /**
     * Callback function for when the title text is selected via a touch tap.
     *
     * @param {object} event TouchTap event targeting the `title` node.
     */
    onTitleTouchTap: PropTypes.func,
    /**
     * Determines whether or not to display the Menu icon next to the title.
     * Setting this prop to false will hide the icon.
     */
    showMenuIconButton: PropTypes.bool,
    /**
     * Override the inline-styles of the root element.
     */
    style: PropTypes.object,
    /**
     * The title to display on the app bar.
     */
    title: PropTypes.node,
    /**
     * Override the inline-styles of the app bar's title element.
     */
    titleStyle: PropTypes.object,
    /**
     * The zDepth of the component.
     * The shadow of the app bar is also dependent on this property.
     */
    zDepth: propTypes.zDepth

  };

  static defaultProps = {
    showMenuIconButton: true,
    title: '',
    notificationCount: 0,
    zDepth: 1,
    showSearchInput : false,
    showSearchIcon : false,
    showNotificationBell: false,
    searchHintStyle : propTypes.searchHintStyle,
    searchUnderlineStyle : propTypes.searchUnderlineStyle,
    searchUnderlineFocusStyle : propTypes.searchUnderlineFocusStyle
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
  };

  componentDidMount() {
    warning(!this.props.iconElementLeft || !this.props.iconClassNameLeft, `Material-UI: Properties iconElementLeft
      and iconClassNameLeft cannot be simultaneously defined. Please use one or the other.`);

    warning(!this.props.iconElementRight || !this.props.iconClassNameRight, `Material-UI: Properties iconElementRight
      and iconClassNameRight cannot be simultaneously defined. Please use one or the other.`);
  }

  handleTouchTapLeftIconButton = (event) => {
    if (this.props.onLeftIconButtonTouchTap) {
      this.props.onLeftIconButtonTouchTap(event);
    }
  };

  handleTouchTapRightIconButton = (event) => {
    if (this.props.onRightIconButtonTouchTap) {
      this.props.onRightIconButtonTouchTap(event);
    }
  };

  handleTitleTouchTap = (event) => {
    if (this.props.onTitleTouchTap) {
      this.props.onTitleTouchTap(event);
    }
  };
  toggleTextField = () => {
    this.props.getStatus(!this.props.showTextField)
  }
  toggleNotification = () => {
    this.props.showNotificationTab(!this.state.showNotification);
    this.setState({
      showNotification: !this.state.showNotification
    });

  }
  onCancel = () => {
    this.setState({
      clearText : true
    },function(){
      this.setState({
      clearText : false
      })
    })
  }
  render() {
    const {
      title,
      titleStyle,
      iconStyleLeft,
      iconStyleRight,
      onTitleTouchTap, // eslint-disable-line no-unused-vars
      showMenuIconButton,
      iconElementLeft,
      iconElementRight,
      iconClassNameLeft,
      iconClassNameRight,
      onLeftIconButtonTouchTap, // eslint-disable-line no-unused-vars
      onRightIconButtonTouchTap, // eslint-disable-line no-unused-vars
      className,
      style,
      zDepth,
      children,
      showSearchInput,
      showNotificationBell,
      showSearchIcon,
      ...other
    } = this.props;

    const {prepareStyles} = this.context.muiTheme;
    const styles = getStyles(this.props, this.context);

    let menuElementLeft;
    let menuElementRight;
    let searchInput;
    let searchIcon;
    let notificationIcon;

    // If the title is a string, wrap in an h1 tag.
    // If not, wrap in a div tag.
    const titleComponent = typeof title === 'string' || title instanceof String ? 'h1' : 'div';

    const titleElement = React.createElement(titleComponent, {
      onTouchTap: this.handleTitleTouchTap,
      style: prepareStyles(Object.assign(styles.title, styles.mainElement, titleStyle)),
    }, title);

    const iconLeftStyle = Object.assign({}, styles.iconButtonStyle, iconStyleLeft);

    if (showMenuIconButton) {
      if (iconElementLeft) {
        const iconElementLeftProps = {};

        if (iconElementLeft.type.muiName === 'IconButton') {
          const iconElemLeftChildren = iconElementLeft.props.children;
          const iconButtonIconStyle = !(
            iconElemLeftChildren &&
            iconElemLeftChildren.props &&
            iconElemLeftChildren.props.color
          ) ? styles.iconButtonIconStyle : null;

          iconElementLeftProps.iconStyle = Object.assign({}, iconButtonIconStyle, iconElementLeft.props.iconStyle);
        }

        if (!iconElementLeft.props.onTouchTap && this.props.onLeftIconButtonTouchTap) {
          iconElementLeftProps.onTouchTap = this.handleTouchTapLeftIconButton;
        }

        menuElementLeft = (
          <div style={prepareStyles(iconLeftStyle)}>
            {Object.keys(iconElementLeftProps).length > 0 ?
              cloneElement(iconElementLeft, iconElementLeftProps) :
              iconElementLeft}
          </div>
        );
      } else {
        menuElementLeft = (
          <IconButton
            style={iconLeftStyle}
            iconStyle={styles.iconButtonIconStyle}
            iconClassName={iconClassNameLeft}
            onTouchTap={this.handleTouchTapLeftIconButton}
          >
            {iconClassNameLeft ?
              '' :
              <NavigationMenu style={Object.assign({}, styles.iconButtonIconStyle)} />
            }
          </IconButton>
        );
      }
    }

    const iconRightStyle = Object.assign({}, styles.iconButtonStyle, {
      marginRight: -16,
      marginLeft: 'auto',
    }, iconStyleRight);

    if (iconElementRight) {
      const iconElementRightProps = {};

      switch (iconElementRight.type.muiName) {
        case 'IconMenu':
        case 'IconButton':
          const iconElemRightChildren = iconElementRight.props.children;
          const iconButtonIconStyle = !(
            iconElemRightChildren &&
            iconElemRightChildren.props &&
            iconElemRightChildren.props.color
          ) ? styles.iconButtonIconStyle : null;

          iconElementRightProps.iconStyle = Object.assign({}, iconButtonIconStyle, iconElementRight.props.iconStyle);
          break;

        case 'FlatButton':
          iconElementRightProps.style = Object.assign({}, styles.flatButton, iconElementRight.props.style);
          break;

        default:
      }

      if (!iconElementRight.props.onTouchTap && this.props.onRightIconButtonTouchTap) {
        iconElementRightProps.onTouchTap = this.handleTouchTapRightIconButton;
      }

      menuElementRight = (
        <div style={prepareStyles(iconRightStyle)}>
          {Object.keys(iconElementRightProps).length > 0 ?
            cloneElement(iconElementRight, iconElementRightProps) :
            iconElementRight}
        </div>
      );
    } else if (iconClassNameRight) {
      menuElementRight = (
        <IconButton
          style={iconRightStyle}
          iconStyle={styles.iconButtonIconStyle}
          iconClassName={iconClassNameRight}
          onTouchTap={this.handleTouchTapRightIconButton}
        />
      );
    }
    if(showSearchInput){
    searchInput = (
  	    		<div style={{"width":"100%","position":"relative"}}>
  	    		 {this.props.showTextField ? <AutoComplete dataSourceConfig={this.props.dataSourceConfig} filter={this.props.filter} dataSource={this.props.dataSource} hintText={this.props.searchHintText}  underlineStyle={this.props.searchUnderlineStyle}
              hintStyle={this.props.hintStyle} clearInput={this.state.clearText}   textFieldStyle={this.props.textFieldStyle} inputStyle={this.props.inputStyle} onNewRequest={this.props.onNewRequest} /> : null}

  	    		{ !this.props.showTextField ? <i className="material-icons" onClick={this.toggleTextField} style={this.props.searchIconStyle} >search</i>  :
  		    	 <i className="material-icons" onClick={this.onCancel} style={this.props.searchIconStyle}>cancel</i>		}
  		    	</div>
    )
    }
    if(showSearchIcon){

        searchIcon = (<div style={{"position":"relative"}}>
        <i className="material-icons" onClick={this.toggleTextField} style={this.props.searchIconStyle} >search</i>
        </div>
      )

    }
    if(showNotificationBell){
      notificationIcon = (
        <div style={{position:'relative',cursor:'pointer'}} onClick={this.toggleNotification} >
          <i className="material-icons"  style={{position: 'absolute',bottom: '18px',color: '#FFF',right: '53px',fontSize:'28px'}}>notifications_none</i>
          {this.props.notificationCount?
            <span style={{position: 'absolute',right: '45px',top: '11px',background: '#FFF',width: '24px',height: '24px',fontWeight: 'bold',borderRadius: '50%',zIndex:'20',textAlign: 'center',justifyContent:'center',alignContent:'center',display:'flex',flexFlow:'row wrap',alignItems:'center',fontSize:'12px'}}>
              {this.props.notificationCount}
            </span>
            : null}
        </div>
        )
    }
    return (
      <Paper
        {...other}
        rounded={false}
        className={className}
        style={Object.assign({}, styles.root, style)}
        zDepth={zDepth}
      >
        {menuElementLeft}
        {titleElement}
        {searchInput}
        {searchIcon}
        {notificationIcon}
        {menuElementRight}
        {children}
      </Paper>
    );
  }
}

export default AppBar;
