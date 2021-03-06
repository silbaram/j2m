(function(window, document){
	"use strict";

	function j2eObject() {}
	var j2eObjectArr = [], j2eKeyframeConfig = [];

	var _commonConfig = {
				cssFix: "",
				cssAnimation: false,
				styleSheetsIndex: 0
			},
			transformKey = {
				translate: "px",translate3d: "px",translateX: "px",translateY: "px",translateZ: "px",scale: "",scale3d: "",
				scaleX: "",scaleY: "",scaleZ: "",rotate: "deg",rotate3d: "",rotateX: "deg",rotateY: "deg",rotateZ: "deg",
				skew: "deg",skewX: "deg",skewY: "deg",perspective: "px"
			},
			cssUnitValue = {
				backgroundColor : "",borderColor: "",borderLeftColor: "",borderRightColor: "",borderTopColor: "",
				boxShadow: "",columnRule: "",columnRuleColor: "",columns: "",filter: "",flexGrow: "",flexShrink: "",
				fontWeight: "",opacity: "",order: "",outline: "",outlineColor: "",outlineOffset: "",textDecorationColor: "",
				textShadow: "",transformOrigin: "", checkStyle: ""
			},
			cssInitialValueType = {
				backgroundSize: "background-size"
			},
			J2E_CONSTANT = {
				STYLESHEET_LOCALNAME: "style",
				START_RULE_KEY_NAME: "0%",
				START_NO_UNIT_RULE_KEY_NAME: "0",
				END_RULE_KEY_NAME: "100%",
				END_NO_UNIT_RULE_KEY_NAME: "1",
				ABSOLUTE_POSITION_TYPE: "absolute",
				RELATIVE_POSITION_TYPE: "relative",
				INCREASE: "+=",
				DECREASE: "-=",
				J2E_ANIMATE_ID_NAME: "j2eAnimateIdNo_",
				J2E_ANIMATE_ID_KEY: "j2eid",
				TRANSFORM_NAME: "transform",
				ANIMATION_START: "start",
				ANIMATION_END: "end"
			};



	var
		_j2e = {
			selector: function(e) {

				if(e !== document && e !== window) {
					var elementConfig = {};
					var cloneObject = new j2eObject;

					if(typeof e == "object") {
						elementConfig.targetElement = e;
					} else {
						let c = "";
						if(e !== null) {
							e = e.toString();
							c = e.substr(0, 1);
						};

						if(c === ".") {
							elementConfig.targetElement = document.getElementsByClassName(e.substr(1, e.length))[0];
						}
						else if(c === "#") {
							elementConfig.targetElement = document.getElementById(e.substr(1, e.length));
						}
					}

					//고유 아이디 부여
					if(elementConfig.targetElement.getAttribute(J2E_CONSTANT.J2E_ANIMATE_ID_KEY) === null) {
						elementConfig.targetElement.setAttribute(J2E_CONSTANT.J2E_ANIMATE_ID_KEY, J2E_CONSTANT.J2E_ANIMATE_ID_NAME + j2eObjectArr.length);
					}

					if(j2eObjectArr[elementConfig.targetElement.getAttribute(J2E_CONSTANT.J2E_ANIMATE_ID_KEY)] === undefined) {
						cloneObject.elementConfig = elementConfig;
						cloneObject.elementConfig.animationOption = {delay: '', direction: '', duration: '', fillMode: '', iterationCount: '', timingFunction: '', willChange:false, callBack: ""};
						cloneObject.elementConfig.animationEvent = {transition: false, keyframe: false};

						j2eObjectArr.push(elementConfig.targetElement.getAttribute(J2E_CONSTANT.J2E_ANIMATE_ID_KEY));
						j2eObjectArr[elementConfig.targetElement.getAttribute(J2E_CONSTANT.J2E_ANIMATE_ID_KEY)] = elementConfig;
					} else {
						cloneObject.elementConfig = j2eObjectArr[elementConfig.targetElement.getAttribute(J2E_CONSTANT.J2E_ANIMATE_ID_KEY)];
					}

					return cloneObject;
				} else {
					console.error("document, window 객체는 사용할 수 없습니다.");
					return e;
				}
			},
			addRole: function(s) {
				var j2eCheckKeyframeConfig = {};
				var keyframes = '@' + _commonConfig.cssFix + "keyframes " + s.name + " { ";
				var keyframesText = _j2eKeyFrameUtil.createRole(s.role, j2eCheckKeyframeConfig);
				keyframes += keyframesText;
				keyframes += "}";

				if(keyframesText) {
					if(j2eKeyframeConfig[s.name] === undefined) {
						j2eKeyframeConfig.push(s.name);
						j2eKeyframeConfig[s.name] = j2eCheckKeyframeConfig;
						j2eCheckKeyframeConfig.index = document.styleSheets[_commonConfig.styleSheetsIndex].cssRules.length;
						j2eCheckKeyframeConfig.synchronization = {useElement:"", status:false}
					}
					document.styleSheets[_commonConfig.styleSheetsIndex].insertRule( keyframes, document.styleSheets[_commonConfig.styleSheetsIndex].cssRules.length );

					var stylesheetValue = _j2eKeyFrameUtil.getStyleSheet(s.name);
					var keyframesRule = "";
					try {
						keyframesRule = stylesheetValue.keyframes.findRule(J2E_CONSTANT.START_RULE_KEY_NAME);
					} catch(e) {
						keyframesRule = stylesheetValue.keyframes.findRule(J2E_CONSTANT.START_NO_UNIT_RULE_KEY_NAME);
					}

					if(keyframesRule === null) {
						j2eCheckKeyframeConfig.j2ePositionType = J2E_CONSTANT.RELATIVE_POSITION_TYPE;
					} else {
						j2eCheckKeyframeConfig.j2ePositionType = J2E_CONSTANT.ABSOLUTE_POSITION_TYPE;
					}
				}
			}
		};


	var
		_j2eUtil = {
			createFunction: function(n, c) {
				j2eObject.prototype[n] = c;
			},
			init: (function() {
				var cssAnimation = false,
						animationstring = 'animation',
						keyframeprefix = '',
						domPrefixes = 'Webkit/Moz/O/ms/Khtml'.split('/'),
						pfx = '';

				cssUnitValue.checkStyle = document.body.style;

				if( cssUnitValue.checkStyle.animationName ) { cssAnimation = true; }

				if( cssAnimation === false ) {
				  for( var i = 0, iLength = domPrefixes.length; i < iLength; i++ ) {
						if( cssUnitValue.checkStyle[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
						  pfx = domPrefixes[ i ];
						  animationstring = pfx + 'Animation';
						  keyframeprefix = '-' + pfx.toLowerCase() + '-';
						  cssAnimation = true;
						  break;
						}
				  }
				}

				_commonConfig.cssFix = keyframeprefix;
				_commonConfig.cssAnimation = cssAnimation;

				//style 유무 판단, styleSheets에서 위치 조회
				var styleTagCheck = false;
				for(let i = 0, iLength = document.styleSheets.length; i < iLength; i++) {
					if(document.styleSheets[i].ownerNode.localName === J2E_CONSTANT.STYLESHEET_LOCALNAME) {
						_commonConfig.styleSheetsIndex = i;
						styleTagCheck = true;
						break;
					}
				}

				//X브라우징 되는지 확인 해야됨
				if(!styleTagCheck) {
					var head = document.getElementsByTagName("head")[0];
					if (head) {
						var styleEl = document.createElement("style");
						styleEl.type = "text/css";
						head.appendChild(styleEl);
						styleEl = null;

						for(let i = document.styleSheets.length-1; i >= 0; i--) {
							if(document.styleSheets[i].ownerNode.localName === J2E_CONSTANT.STYLESHEET_LOCALNAME) {
								_commonConfig.styleSheetsIndex = i;
								break;
							}
						}
					}
				}
			}()),
			prefixedEventListener: function(element, type, callback) {
				var pfx = ["webkit", "moz", "MS", "o", ""];
			  for (var p = 0; p < pfx.length; p++) {
			  	if (!pfx[p]) {
						type = type.toLowerCase();
					}

					element.addEventListener(pfx[p]+type, callback, false);
			  }
			}
		};


	//초기값이 설정이 none, auto로 나올때 기본값 찾기
	var
		_j2eCommonCssUtil = {
			getCssInitialValue: function(cssName, elm) {
				if(cssInitialValueType.backgroundSize === cssName) {
					var backgorundStyle = window.getComputedStyle !== undefined ? getComputedStyle(elm, null) : elm.currentStyle;
					var startBackgorundTmep = backgorundStyle[cssInitialValueType.backgroundSize].split(" ");

					var backgroundImage = new Image();

					if(startBackgorundTmep.length == 1) {
						if(startBackgorundTmep[0] == "auto") {
							backgroundImage.src = backgorundStyle["backgroundImage"].replace(/url\((['"])?(.*?)\1\)/gi, '$2');
							return {x : backgroundImage.width, y : backgroundImage.height};
						} else {
							return  {x : parseFloat(startBackgorundTmep[0].replace(regex, '')), y : "auto"};
						}
					} else if(startBackgorundTmep.length == 2) {
						if(startBackgorundTmep[0] == "auto" && startBackgorundTmep[1] == "auto") {
							backgroundImage.src = backgorundStyle["backgroundImage"].replace(/url\((['"])?(.*?)\1\)/gi, '$2');
							return  {x : backgroundImage.width, y : backgroundImage.height};
						} else if(startBackgorundTmep[0] == "auto" || startBackgorundTmep[1] == "auto") {
							return  {x : startBackgorundTmep[0] == "auto" ? "auto" : parseFloat(startBackgorundTmep[0].replace(regex, '')), y : startBackgorundTmep[1] == "auto" ? "auto" : parseFloat(startBackgorundTmep[1].replace(regex, ''))};
						} else {
							return  {x : parseFloat(startBackgorundTmep[0].replace(regex, '')), y : parseFloat(startBackgorundTmep[1].replace(regex, ''))};
						}
					}
				}
			},
			getChangeCssKey: function(w) {
				var wordChk = /[A-Z]/;

				if(wordChk.test(w)) {
					for(let i = 0, wordLength = w.length; i < wordLength; i++) {
						if(wordChk.test(w[i])) {
							w = w.replace(w.charAt(i), "-"+w.charAt(i).toLowerCase());
						}
					}
				}
				return w;
			}
		};


	var
		_j2eKeyFrameUtil = {
			createRole: function(s, j2eCheckKeyframeConfig) {
				var roleText = "";
				var transformRoleText = " " + J2E_CONSTANT.TRANSFORM_NAME + ": ";
				var cssRoleText = "";
				var transformRoleUse = false;
				var increaseAndDecreaseArray = [];
				var newItem = [];

				for(let key in s) {
					try {
						transformRoleText = " " + J2E_CONSTANT.TRANSFORM_NAME + ": ";
						transformRoleUse = false;
						let keyText = s[key].share === "from" ? J2E_CONSTANT.START_RULE_KEY_NAME+" " : s[key].share === "to" ? J2E_CONSTANT.END_RULE_KEY_NAME+" " : s[key].share.replace === undefined ? s[key].share+"% " : s[key].share.replace("%", "")+"% ";
						roleText += keyText	+ "{";
						for(let subKey in s[key]) {
							//transform 조합
							if(subKey !== "share") {
								if(transformKey[subKey] !== undefined) {
									transformRoleUse = true;
									let originTextKey = s[key][subKey];
									let textKey = "";
									if(originTextKey.replace === undefined) {
										originTextKey = originTextKey.toString();
										textKey = originTextKey;
									} else {
										textKey = originTextKey.replace(J2E_CONSTANT.INCREASE, "").replace(J2E_CONSTANT.DECREASE, "");
									}

									//transform이 여러 방향(,) 할당될때 처리
									let textKeyArray = textKey.split(",");
									transformRoleText += " " + subKey + "(";
									for(let textKeyArrayIndex = 0, textKeyArrayLength = textKeyArray.length; textKeyArrayIndex < textKeyArrayLength; textKeyArrayIndex++) {
										let unit = isNaN(textKeyArray[textKeyArrayIndex]) === false ? transformKey[subKey] : "";
										let commaUnit = textKeyArrayIndex == 0 ? "" : " ,";

										transformRoleText += commaUnit + textKeyArray[textKeyArrayIndex] + unit;
									}
									transformRoleText += ")";

									//증감 유무 체크
									if(originTextKey.indexOf(J2E_CONSTANT.INCREASE) === 0 || originTextKey.indexOf(J2E_CONSTANT.DECREASE) === 0) {
										if(increaseAndDecreaseArray[keyText] === undefined) {
											increaseAndDecreaseArray.push(keyText);
										}

										newItem.push(subKey);
										newItem[subKey] = originTextKey;
										increaseAndDecreaseArray[keyText] = newItem;
									}
								}
							}
						}

						if(transformRoleUse) {
							roleText += transformRoleText + ";";
						}

						cssRoleText = "";

						for(let subKey in s[key]) {
							//css 조합
							if(subKey !== "share") {
								if(cssUnitValue.checkStyle[subKey] !== undefined) {
									let unit = "";
									let originTextKey = s[key][subKey];
									let textKey = "";
									if(originTextKey.replace === undefined) {
										originTextKey = originTextKey.toString();
										textKey = originTextKey;
									} else {
										textKey = originTextKey.replace(J2E_CONSTANT.INCREASE, "").replace(J2E_CONSTANT.DECREASE, "");
									}

									let textKeyArray = textKey.split(" ");
									for(let textKeyArrayIndex = 0, textKeyArrayLength = textKeyArray.length; textKeyArrayIndex < textKeyArrayLength; textKeyArrayIndex++) {
										if(textKeyArray[textKeyArrayIndex] != "") {
											let unit = isNaN(textKeyArray[textKeyArrayIndex]) === false ? cssUnitValue[subKey] !== undefined ? cssUnitValue[subKey] : "px" : "";
											let space = textKeyArrayIndex+1 < textKeyArrayLength ? " " : "";
											cssRoleText += textKeyArray[textKeyArrayIndex] + unit + space;
										}
									}

									//증감 유무 체크
									if(originTextKey.indexOf(J2E_CONSTANT.INCREASE) === 0 || originTextKey.indexOf(J2E_CONSTANT.DECREASE) === 0) {
										if(increaseAndDecreaseArray[keyText] === undefined) {
											increaseAndDecreaseArray.push(keyText);
										}

										newItem.push(_j2eCommonCssUtil.getChangeCssKey(subKey));
										newItem[_j2eCommonCssUtil.getChangeCssKey(subKey)] = originTextKey;
										increaseAndDecreaseArray[keyText] = newItem;
									}

									roleText += " " + _j2eCommonCssUtil.getChangeCssKey(subKey) + ": " + cssRoleText + ";";
								}
							}
						}

						roleText += "} ";
					} catch(e) {
						console.error(e);
						console.error("keyframe 생성 중 에러가 발생했습니다.");
						return false;
					}
				}

				j2eCheckKeyframeConfig.increaseAndDecrease = increaseAndDecreaseArray;

				return roleText;
			},
			setStartingPosition: function(elm, animationName) {
				//상대위치 타입이면 현제 위치를 시작 위치로 변경 해준다.
				if(j2eKeyframeConfig[animationName].j2ePositionType === J2E_CONSTANT.RELATIVE_POSITION_TYPE) {
					let stylesheetValue = _j2eKeyFrameUtil.getStyleSheet(animationName);
					let keyframesRule = "";
					let startKeyRuleName = "";
					let endKeyRuleName = "";
					try {
						keyframesRule = stylesheetValue.keyframes.findRule(J2E_CONSTANT.START_RULE_KEY_NAME);
						startKeyRuleName = J2E_CONSTANT.START_RULE_KEY_NAME;
						endKeyRuleName = J2E_CONSTANT.END_RULE_KEY_NAME;
					} catch(e) {
						keyframesRule = stylesheetValue.keyframes.findRule(J2E_CONSTANT.START_NO_UNIT_RULE_KEY_NAME);
						startKeyRuleName = J2E_CONSTANT.START_NO_UNIT_RULE_KEY_NAME;
						endKeyRuleName = J2E_CONSTANT.END_NO_UNIT_RULE_KEY_NAME;
					}

					if(keyframesRule === null) {
						stylesheetValue.keyframes.appendRule(J2E_CONSTANT.START_RULE_KEY_NAME+" {}");
					} else {
						stylesheetValue.keyframes.deleteRule(startKeyRuleName);
						stylesheetValue.keyframes.appendRule(J2E_CONSTANT.START_RULE_KEY_NAME+" {}");
					}

					let startRuleStyle = stylesheetValue.keyframes.findRule(startKeyRuleName).style;
					let endRuleStyle = stylesheetValue.keyframes.findRule(endKeyRuleName).style;

					for(let item = 0, itemLenght = endRuleStyle.length; item < itemLenght; item++) {
						let endRuleStyleKey = endRuleStyle[item];
						let cssValue = window.getComputedStyle !== undefined ? getComputedStyle(elm, null)[endRuleStyleKey] : elm.currentStyle[endRuleStyleKey];

						if(endRuleStyleKey === cssInitialValueType.backgroundSize && cssValue === "auto") {
							let backgroundSizeValue = _j2eCommonCssUtil.getCssInitialValue(cssInitialValueType.backgroundSize, elm);
							cssValue = backgroundSizeValue.x+"px " +backgroundSizeValue.y+"px";
						}

						startRuleStyle[endRuleStyleKey] = cssValue;
						elm.style[endRuleStyleKey] = cssValue;
					}
				}
			},
			setIncreaseAndDecreasePosition: function(elm, animationName) {
				var stylesheetValue = _j2eKeyFrameUtil.getStyleSheet(animationName);
				var transformCssValue = window.getComputedStyle !== undefined ? getComputedStyle(elm, null)[J2E_CONSTANT.TRANSFORM_NAME] : elm.currentStyle[J2E_CONSTANT.TRANSFORM_NAME];

				for(let i = 0, iLength = j2eKeyframeConfig[animationName].increaseAndDecrease.length; i < iLength; i++) {
					let key = j2eKeyframeConfig[animationName].increaseAndDecrease[i];
					let rule = stylesheetValue.keyframes.findRule(j2eKeyframeConfig[animationName].increaseAndDecrease[i]);

					for(let item = 0, itemLenght = rule.style.length; item < itemLenght; item++) {
						let styleItemKey = rule.style[item];
						let moveValue = j2eKeyframeConfig[animationName].increaseAndDecrease[key];

						//transform css인 경우
						if(styleItemKey === J2E_CONSTANT.TRANSFORM_NAME) {
							let transformNewRoleText = "";
							let transformValueArray = rule.style[J2E_CONSTANT.TRANSFORM_NAME].split(") ");

							for(let i = 0, iLength = transformValueArray.length; i < iLength; i++) {
								let transformNewMoveValue = moveValue[transformValueArray[i].split("(")[0]];
								if(transformNewMoveValue !== undefined) {
									let transformOldMoveValue = transformValueArray[i].split("(")[1].replace(")", "").split(", ");
									let transformNewMoveValueArray = transformNewMoveValue.split(",");

									transformNewRoleText += transformValueArray[i].split("(")[0].replace(")", "").split(", ")[0] + "(";
									for(let index = 0, maxIndex = transformNewMoveValueArray.length; index < maxIndex; index++) {
										let newMoveValue = transformNewMoveValueArray[index];
										let oldMoveValue = transformOldMoveValue[index];
										let commaUnit = index == 0 ? "" : " ,";

										if(transformNewMoveValueArray[index].indexOf(J2E_CONSTANT.INCREASE) === 0) {
											let numberNewMoveValue = Number(newMoveValue.replace(J2E_CONSTANT.INCREASE,""));
											let numberOldMoveValue = Number(oldMoveValue.replace(/[(A-Z)]/gi,""));
											if(transformCssValue !== "none") {
												transformNewRoleText += commaUnit + (numberNewMoveValue + numberOldMoveValue) + oldMoveValue.replace(/[^(A-Z)]/gi,"");
											}
										} else if (transformNewMoveValueArray[index].indexOf(J2E_CONSTANT.DECREASE) === 0) {
											let numberNewMoveValue = Number(newMoveValue.replace(J2E_CONSTANT.DECREASE,""));
											let numberOldMoveValue = Number(oldMoveValue.replace(/[(A-Z)]/gi,""));
											if(transformCssValue === "none") {
												transformNewRoleText += commaUnit + (numberOldMoveValue - (numberOldMoveValue+numberNewMoveValue)) + oldMoveValue.replace(/[^(A-Z)]/gi,"");
											} else {
												transformNewRoleText += commaUnit + (numberOldMoveValue - numberNewMoveValue) + oldMoveValue.replace(/[^(A-Z)]/gi,"");
											}

										} else {
											transformNewRoleText += commaUnit + oldMoveValue;
										}
									}
									transformNewRoleText += ") ";
								} else {
									transformNewRoleText += transformValueArray[i];
								}
							}

							rule.style[J2E_CONSTANT.TRANSFORM_NAME] = transformNewRoleText;

						} else {
							let moveValue = j2eKeyframeConfig[animationName].increaseAndDecrease[key][styleItemKey];

							if(moveValue !== undefined) {
								let styleValue = window.getComputedStyle !== undefined ? getComputedStyle(elm, null)[styleItemKey] : elm.currentStyle[styleItemKey];

								// 버그 : === 0으로 하면 여러개의 값이 올경우 처리가 안됨
								if(moveValue.indexOf(J2E_CONSTANT.INCREASE) === 0) {
									rule.style[styleItemKey] = (Number(moveValue.replace(J2E_CONSTANT.INCREASE,"")) + Number(styleValue.replace(/[(A-Z)]/gi,""))) + styleValue.replace(/[^(A-Z)]/gi,"");
								} else if (moveValue.indexOf(J2E_CONSTANT.DECREASE) === 0) {
									rule.style[styleItemKey] = (Number(styleValue.replace(/[(A-Z)]/gi,"")) - Number(moveValue.replace(J2E_CONSTANT.DECREASE,""))) + styleValue.replace(/[^(A-Z)]/gi,"");
								}
							}
						}
					}
				}
			},
			getStyleSheet: function(animationName) {
				var stylesheet = document.styleSheets[_commonConfig.styleSheetsIndex],
						keyframes = stylesheet.cssRules[j2eKeyframeConfig[animationName].index],
						cssRules = keyframes.cssRules;

				return {stylesheet: stylesheet, keyframes: keyframes, cssRules: cssRules}
			},
			setStartAnimateInfo: function(that, funS) {
				let animationName = funS.name;
				let j2eKeyframeConfigValue = j2eKeyframeConfig[animationName];
				if(j2eKeyframeConfigValue === undefined) {
					console.error("없는 keyframe name 입니다.");
					return that;
				}

				//룰 추가
				if(funS.role !== undefined) {
					_j2e.addRole(funS);
				}

				let elm = that.elementConfig.targetElement;
				let willChangeValue = "";
				let willChangeCheckValue = that.elementConfig.animationOption.willChange;
				if(willChangeCheckValue === true) {
					let stylesheetValue = _j2eKeyFrameUtil.getStyleSheet(animationName);
					for(let i = 0, iMax = stylesheetValue.cssRules.length; i < iMax; i++) {
						let cssRulesValue = stylesheetValue.cssRules[i];
						if(cssRulesValue.keyText !== J2E_CONSTANT.START_RULE_KEY_NAME) {
							for(let j = 0, jMax = cssRulesValue.style.length; j < jMax; j++) {
								willChangeValue += willChangeValue.indexOf(cssRulesValue.style[j]) === -1 ? willChangeValue === "" ? cssRulesValue.style[j] : ", " + cssRulesValue.style[j] : "";
							}
						}
					}
				}

				let animationNameCheck = elm.style["animation-name"];
				let elmAniStatus = that.elementConfig.elemantAnimationStatus;
				let j2ePositionType = j2eKeyframeConfigValue.j2ePositionType;
				let iadCount = j2eKeyframeConfigValue.increaseAndDecrease.length;
				if(animationNameCheck !== "" && animationNameCheck !== animationName) {
					_j2eKeyFrameUtil.choiceAnimateType(1, that, willChangeCheckValue, willChangeValue, elm, j2ePositionType, iadCount, animationName, j2eKeyframeConfigValue);
				} else if(iadCount > 0 && (elmAniStatus === J2E_CONSTANT.ANIMATION_END || elmAniStatus === undefined)) {
					_j2eKeyFrameUtil.choiceAnimateType(2, that, willChangeCheckValue, willChangeValue, elm, j2ePositionType, iadCount, animationName, j2eKeyframeConfigValue);
				} else if (iadCount === 0 && j2ePositionType === J2E_CONSTANT.RELATIVE_POSITION_TYPE) {
					_j2eKeyFrameUtil.choiceAnimateType(2, that, willChangeCheckValue, willChangeValue, elm, j2ePositionType, iadCount, animationName, j2eKeyframeConfigValue);
				} else if(j2ePositionType === J2E_CONSTANT.ABSOLUTE_POSITION_TYPE) {
					_j2eKeyFrameUtil.choiceAnimateType(3, that, willChangeCheckValue, willChangeValue, elm, j2ePositionType, iadCount, animationName, j2eKeyframeConfigValue);
				}

				return that;
			},
			choiceAnimateType: function(type, that, willChangeCheckValue, willChangeValue, elm, j2ePositionType, iadCount, animationName, j2eKeyframeConfigValue) {
				if(type === 1) {
					that.elementConfig.elemantAnimationStatus = J2E_CONSTANT.ANIMATION_START;

					if(willChangeCheckValue === true) {
						elm.style.willChange = willChangeValue;
					}

					j2eKeyframeConfigValue.synchronization.status = true;
					j2eKeyframeConfigValue.synchronization.useElement = elm.getAttribute(J2E_CONSTANT.J2E_ANIMATE_ID_KEY);

					// 현재위치 세팅
					if(j2ePositionType === J2E_CONSTANT.RELATIVE_POSITION_TYPE) {
						_j2eKeyFrameUtil.setStartingPosition(elm, animationName);
					}

					// //위치 증감 세팅
					if(iadCount > 0) {
						_j2eKeyFrameUtil.setIncreaseAndDecreasePosition(elm, animationName);
					}

					elm.style.animation = '';
					_j2eKeyFrameUtil.startAnimate(elm, animationName, that, false);
				} else if(type === 2) {
					that.elementConfig.elemantAnimationStatus = J2E_CONSTANT.ANIMATION_START;

					if(willChangeCheckValue === true) {
						elm.style.willChange = willChangeValue;
					}

					if(j2eKeyframeConfigValue.synchronization.status === false) {
						j2eKeyframeConfigValue.synchronization.status = true;
						j2eKeyframeConfigValue.synchronization.useElement = elm.getAttribute(J2E_CONSTANT.J2E_ANIMATE_ID_KEY);

						// 현재위치 세팅
						if(j2ePositionType === J2E_CONSTANT.RELATIVE_POSITION_TYPE) {
							_j2eKeyFrameUtil.setStartingPosition(elm, animationName);
						}

						// //위치 증감 세팅
						if(iadCount > 0) {
							_j2eKeyFrameUtil.setIncreaseAndDecreasePosition(elm, animationName);
						}
					}

					elm.style.animation = '';
					_j2eKeyFrameUtil.startAnimate(elm, animationName, that, true);
				} else if(type === 3) {
					if(willChangeCheckValue === true) {
						elm.style.willChange = willChangeValue;
					}

					elm.style.animation = '';
					_j2eKeyFrameUtil.startAnimate(elm, animationName, that, true);
				}

			},
			startAnimate: function(elm, animationName, that, animateType) {

				var animationOption = that.elementConfig.animationOption;

				var animationOptionTemp = "";
				// for(let key in animationOption) {
				// 	if(animationOption[key] !== "" && key !== "willChange") {
				// 		animationOptionTemp += ' ' + animationOption[key];
				// 	}
				// }

				if(animationOption.duration === "") {
					console.error("시간 설정이 빠져있습니다.");
					console.error("j2e(selector).setDuration().animate(); 와 같은 형식으로 animaite 함수가 마지막에 위치 하도록 하셔야 합니다.");
					return;
				}

				animationOptionTemp = animationOptionTemp + ' ' + animationOption.duration;
				if(animationOption.delay !== "") {
					animationOptionTemp = animationOptionTemp + ' ' + animationOption.delay;
				}
				if(animationOption.direction !== "") {
					animationOptionTemp = animationOptionTemp + ' ' + animationOption.direction;
				}
				if(animationOption.fillMode !== "") {
					animationOptionTemp = animationOptionTemp + ' ' + animationOption.fillMode;
				}
				if(animationOption.iterationCount !== "") {
					animationOptionTemp = animationOptionTemp + ' ' + animationOption.iterationCount;
				}
				if(animationOption.timingFunction !== "") {
					animationOptionTemp = animationOptionTemp + ' ' + animationOption.timingFunction;
				}

				if(animateType) {
					setTimeout(function () {elm.style.animation = animationName + animationOptionTemp;}, 10);
				} else {
					elm.style.animation = animationName + animationOptionTemp;
				}

				if(that.elementConfig.animationEvent.keyframe === false) {
					that.elementConfig.animationEvent.keyframe = true;

					_j2eUtil.prefixedEventListener(elm, "AnimationStart", function(e){
					});

					_j2eUtil.prefixedEventListener(elm, "AnimationIteration", function(e){
					});

					_j2eUtil.prefixedEventListener(elm, "AnimationEnd", function(e){

						that.elementConfig.elemantAnimationStatus = J2E_CONSTANT.ANIMATION_END;

						//여러 element가 하나의 keyframe의 rule에 데이터 변경에 대한 접근을 할 수 있도록 속성 변경
						if(elm.getAttribute(J2E_CONSTANT.J2E_ANIMATE_ID_KEY) === j2eKeyframeConfig[animationName].synchronization.useElement) {
							j2eKeyframeConfig[animationName].synchronization.status = false;
							j2eKeyframeConfig[animationName].synchronization.useElement = "";
						}

						if(that.elementConfig.animationOption.willChange === true) {
							elm.style.willChange = 'auto';
						}

						if(that.elementConfig.animationOption.callBack !== "") {
							that.elementConfig.animationOption.callBack();
						}

						that.elementConfig.animationOption = {delay: '', direction: '', duration: '', fillMode: '', iterationCount: '', timingFunction: '', willChange:false, callBack: ""};
					});
				}
			}
		};



		var
			_j2eTransitionUtil = {
				createRole: function(role, that) {
					var animationOption = that.elementConfig.animationOption;
					var transitionRoleTemp = "";
					var transformRoleUse = false;
					var elm = that.elementConfig.targetElement;

					for(let i = 0, iMaxLength = role.length; i < iMaxLength; i++) {

						let transitionTime = "";
						if(role[i].duration === undefined) {
							transitionTime = animationOption.duration;
						} else {
							transitionTime = role[i].duration + "s";
						}

						let transitionDelay = "";
						if(role[i].delay === undefined) {
							transitionDelay = " " + animationOption.delay;
						} else {
							transitionDelay = "";
						}

						for(let subKey in role[i]) {
							if(subKey !== "duration") {
								let subKeyTemp = "";
								if(transformKey[subKey] !== undefined) {
									subKeyTemp = subKey;
								} else {
									subKeyTemp = _j2eCommonCssUtil.getChangeCssKey(subKey);
								}

								if (cssUnitValue.checkStyle[subKeyTemp] !== undefined) {
									transitionRoleTemp += subKeyTemp + " " + transitionTime + transitionDelay + ", ";
								} else if(transformKey[subKeyTemp] !== undefined && transformRoleUse === false) {
									transformRoleUse = true;
									transitionRoleTemp += J2E_CONSTANT.TRANSFORM_NAME + " " + transitionTime + transitionDelay + ", ";
								}
							}
						}
					}

					return transitionRoleTemp.substring(0, transitionRoleTemp.lastIndexOf(', '));
				},
				setFinishPosition: function(role, that) {
					var elm = that.elementConfig.targetElement;
					var transitionRoleTemp = "";
					var transformRoleText = "";

					for(let i = 0, maxLength = role.length; i < maxLength; i++) {

						for(let subKey in role[i]) {
							//transform 조합
							if(subKey !== "duration") {
								if(transformKey[subKey] !== undefined) {

									let originTextKey = role[i][subKey];
									let textKey = "";
									if(originTextKey.replace === undefined) {
										originTextKey = originTextKey.toString();
										textKey = originTextKey;
									} else {
										textKey = originTextKey.replace(J2E_CONSTANT.INCREASE, "").replace(J2E_CONSTANT.DECREASE, "");
									}

									//transform이 여러 방향(,) 할당될때 처리
									if(originTextKey.indexOf(J2E_CONSTANT.INCREASE) !== 0 && originTextKey.indexOf(J2E_CONSTANT.DECREASE) !== 0) {
										let textKeyArray = textKey.split(",");
										transformRoleText += " " + subKey + "(";
										for(let textKeyArrayIndex = 0, textKeyArrayLength = textKeyArray.length; textKeyArrayIndex < textKeyArrayLength; textKeyArrayIndex++) {
											let unit = isNaN(textKeyArray[textKeyArrayIndex]) === false ? transformKey[subKey] : "";
											let commaUnit = textKeyArrayIndex == 0 ? "" : " ,";

											transformRoleText += commaUnit + textKeyArray[textKeyArrayIndex] + unit;
										}
										transformRoleText += ")";
									//증감 유무 체크
									} else if(originTextKey.indexOf(J2E_CONSTANT.INCREASE) === 0 || originTextKey.indexOf(J2E_CONSTANT.DECREASE) === 0) {
										let styleValue = elm.style[J2E_CONSTANT.TRANSFORM_NAME];
										if(styleValue !== "") {

											let transformValueArray = styleValue.split(") ");

											for(let i = 0, iLength = transformValueArray.length; i < iLength; i++) {
												let transformValueArrayValue = transformValueArray[i];
												if(transformValueArrayValue.indexOf(subKey) > -1) {
													let transformOldMoveValue = transformValueArrayValue.split("(")[1].replace(")", "").split(", ");
													let transformNewMoveValueArray = originTextKey.split(",");

													transformRoleText += subKey + "(";
													for(let index = 0, maxIndex = transformNewMoveValueArray.length; index < maxIndex; index++) {
														let newMoveValue = transformNewMoveValueArray[index];
														let oldMoveValue = transformOldMoveValue[index];
														let commaUnit = index == 0 ? "" : " ,";

														if(transformNewMoveValueArray[index].indexOf(J2E_CONSTANT.INCREASE) === 0) {
															transformRoleText += commaUnit + (Number(newMoveValue.replace(J2E_CONSTANT.INCREASE,"")) + Number(oldMoveValue.replace(/[(A-Z)]/gi,""))) + oldMoveValue.replace(/[^(A-Z)]/gi,"")
														} else if (transformNewMoveValueArray[index].indexOf(J2E_CONSTANT.DECREASE) === 0) {
															transformRoleText += commaUnit + (Number(oldMoveValue.replace(/[(A-Z)]/gi,"")) - Number(newMoveValue.replace(J2E_CONSTANT.DECREASE,""))) + oldMoveValue.replace(/[^(A-Z)]/gi,"");
														} else {
															transformRoleText += commaUnit + oldMoveValue;
														}
													}
													transformRoleText += ") ";
												}
											}
										} else {
											//초기 값을 없을땐 그냥 이동
											let textKeyArray = textKey.split(",");
											transformRoleText += " " + subKey + "(";
											for(let textKeyArrayIndex = 0, textKeyArrayLength = textKeyArray.length; textKeyArrayIndex < textKeyArrayLength; textKeyArrayIndex++) {
												let unit = isNaN(textKeyArray[textKeyArrayIndex]) === false ? transformKey[subKey] : "";
												let commaUnit = textKeyArrayIndex == 0 ? "" : " ,";

												transformRoleText += commaUnit + textKeyArray[textKeyArrayIndex] + unit;
											}
											transformRoleText += ")";
										}
									}
								}
							}
						}

						elm.style[J2E_CONSTANT.TRANSFORM_NAME] = transformRoleText;


						//css 조합
						for(let subKey in role[i]) {

							if(subKey !== "duration") {

								let cssRoleText = "";
								let unit = "";

								if(cssUnitValue.checkStyle[subKey] !== undefined) {
									transitionRoleTemp = transitionRoleTemp + subKey + " ";

									// let unit = "";
									let originTextKey = role[i][subKey];
									let textKey = "";
									if(originTextKey.replace === undefined) {
										originTextKey = originTextKey.toString();
										textKey = originTextKey;
									} else {
										textKey = originTextKey.replace(J2E_CONSTANT.INCREASE, "").replace(J2E_CONSTANT.DECREASE, "");
									}

									let increaseDecreaseYn = false;
									if(originTextKey.indexOf(J2E_CONSTANT.INCREASE) === 0 || originTextKey.indexOf(J2E_CONSTANT.DECREASE) === 0) {
										increaseDecreaseYn = true;
									}
									let textKeyArray = textKey.split(" ");
									if(!increaseDecreaseYn) {
										for(let i = 0, iMaxLength = textKeyArray.length; i < iMaxLength; i++) {
											if(textKeyArray[i] != "") {
												unit = isNaN(textKeyArray[i]) === false ? cssUnitValue[subKey] !== undefined ? cssUnitValue[subKey] : "px" : "";
												let space = i+1 < iMaxLength ? " " : "";
												cssRoleText += textKeyArray[i] + unit + space;
											}
										}
									} else {
										//한개의 값을 경우만 증감 처리 한개 이상일 경우엔 어떤값이 어떤건지 찾을 수가 없음
										if(textKeyArray === 0) {
											let styleValue = window.getComputedStyle !== undefined ? getComputedStyle(elm, null)[subKey] : elm.currentStyle[subKey];
											unit = isNaN(textKeyArray[i]) === false ? cssUnitValue[subKey] !== undefined ? cssUnitValue[subKey] : "px" : "";

											if(originTextKey.indexOf(J2E_CONSTANT.INCREASE) === 0) {
												cssRoleText = (Number(textKey.replace(J2E_CONSTANT.INCREASE,"")) + Number(styleValue.replace(/[(A-Z)]/gi,"")));
											} else if (originTextKey.indexOf(J2E_CONSTANT.DECREASE) === 0) {
												cssRoleText = (Number(styleValue.replace(/[(A-Z)]/gi,"")) - Number(textKey.replace(J2E_CONSTANT.INCREASE,"")));
											}

											cssRoleText += cssRoleText + unit
										} else {
											console.error("애니메이션 효과를 주기 위한 CSS가 한개 이상일 경우 증감 처리가 안됨");
										}
									}

									elm.style[subKey] = cssRoleText;
								}
							}
						}
					}
				},
				setStartAnimateInfo: function(that, funS) {
					let elm = that.elementConfig.targetElement;

					if(funS.role === undefined) {
						console.error("role 설정이 안되엇습니다.");
						return that;
					}

					let willChangeValue = "";
					if(that.elementConfig.animationOption.willChange === true) {
						for(let i = 0, iMax = funS.role.length; i < iMax; i++) {
							for(let key in funS.role[i]) {
								if(key !== "duration") {
									let addKey = transformKey[key] !== undefined ? J2E_CONSTANT.TRANSFORM_NAME : key;
									willChangeValue += willChangeValue.indexOf(addKey) === -1 ? willChangeValue === "" ? addKey : ", " + addKey : "";
								}
							}
						}
						elm.style.willChange = willChangeValue;
					}

					//transition에서 사용할 구문 작성
					_j2eTransitionUtil.startAnimate(elm, funS.role, that);

					return that;
				},
				startAnimate: function(elm, role, that) {
					elm.style.transition = _j2eTransitionUtil.createRole(role, that);
					_j2eTransitionUtil.setFinishPosition(role, that);

					if(that.elementConfig.animationEvent.transition === false) {
						that.elementConfig.animationEvent.transition = true;

						_j2eUtil.prefixedEventListener(elm, "TransitionEnd", function(e){
							if(that.elementConfig.animationOption.willChange === true) {
								elm.style.willChange = 'auto';
							}

							if(that.elementConfig.animationOption.callBack !== "") {
								that.elementConfig.animationOption.callBack();
							}

							that.elementConfig.animationOption = {delay: '', direction: '', duration: '', fillMode: '', iterationCount: '', timingFunction: '', willChange:false, callBack: ""};
						});
					}
				}
		};



		_j2eUtil.createFunction("animate", function(s) {
			var funS = s;
			if(funS === null) {
				console.error("animate 설정이 잘 못 되었습니다.");
				return this;
			}

			var returnValue = this;
			//keyFrame 방식
			if(funS.name !== undefined) {
				returnValue = _j2eKeyFrameUtil.setStartAnimateInfo(this, funS);
			//transition 방식
			} else if(funS.name === undefined) {
				returnValue = _j2eTransitionUtil.setStartAnimateInfo(this, funS);
			}

			return returnValue;
		});

		_j2eUtil.createFunction("setDelay", function(t) {

			if(isNaN(t)) {
				console.error("animationDelay 설정 값이 잘 못 되었습니다. 숫자 형식만 가능합니다.");
				return this;
			}

			this.elementConfig.animationOption.delay = t+"s";

			return this;
		});

		_j2eUtil.createFunction("setDirection", function(s) {

			if("normal" !== s && "reverse" !== s && "alternate" !== s && "alternate-reverse" !== s) {
				console.error("animationDirection 설정값이  잘 못 되었습니다. (normal, reverse, alternate, alternate-reverse) 형식만 가능합니다.");
				return this;
			}

			this.elementConfig.animationOption.direction = s;

			return this;
		});

		_j2eUtil.createFunction("setDuration", function(t) {

			if(isNaN(t)) {
				console.error("animationDuration 설정값이 잘 못 되었습니다. 숫자 형식만 가능합니다.");
				return this;
			}

			this.elementConfig.animationOption.duration = t+"s";

			return this;
		});

		_j2eUtil.createFunction("setFillMode", function(s) {

			if("none" !== s && "forwards" !== s && "backwards" !== s && "both" !== s) {
				console.error("animationFillMode 설정값이  잘 못 되었습니다. (none, forwards, backwards, both) 형식만 가능합니다.");
				return this;
			}

			this.elementConfig.animationOption.fillMode = s;

			return this;
		});

		_j2eUtil.createFunction("setIterationCount", function(s) {

			if(isNaN(s) && s !== "infinite") {
				console.error("animationFillMode 설정값이 잘 못 되었습니다. (숫자, infinite) 형식만 가능합니다.");
				return this;
			}

			this.elementConfig.animationOption.iterationCount = s;

			return this;
		});

		_j2eUtil.createFunction("setPlayState", function(s) {

			if(s !== "paused" && s !== "running") {
				console.error("animationPlayState 설정값이 잘 못 되었습니다. (paused, running) 형식만 가능합니다.");
				return this;
			}

			this.elementConfig.targetElement.style.animationPlayState = s;

			return this;
		});

		_j2eUtil.createFunction("setTimingFunction", function(s) {

			if(s !== "linear" && s !== "ease" && s !== "ease-in" && s !== "ease-out" && s !== "ease-in-out") {
				console.error("animationTimingFunction 설정값이 잘 못 되었습니다. (linear, ease, ease-in, ease-out, ease-in-out) 형식만 가능합니다.");
				return this;
			}

			this.elementConfig.animationOption.timingFunction = s;

			return this;
		});

		_j2eUtil.createFunction("setWillChange", function(f) {

			if(f !== true && f !== false) {
				console.error("willChange 설정값이 잘 못 되었습니다. (true, false) 형식만 가능합니다.");
				return this;
			}

			this.elementConfig.animationOption.willChange = f;

			return this;
		});


		_j2eUtil.createFunction("setCss", function(s, v) {

			if(s === "") {
				console.error("변경하려는 CSS속성을 지정 하셔야 합니다.");
				return this;
			}
			if(v === "") {
				console.error("설정값이 잘 못 되었습니다. 설정값을 지정 하셔야 합니다.");
				return this;
			}

			var elmStyle = this.elementConfig.targetElement.style;

			//transform 조합
			if(transformKey[s] !== undefined) {
				let transformText = "";
				let textKey = v;
				if(textKey.replace === undefined) {
					textKey = textKey.toString();
				}

				//transform이 여러 방향(,) 할당될때 처리
				let textKeyArray = textKey.split(",");
				transformText += " " + s + "(";
				for(let textKeyArrayIndex = 0, textKeyArrayLength = textKeyArray.length; textKeyArrayIndex < textKeyArrayLength; textKeyArrayIndex++) {
					let unit = isNaN(textKeyArray[textKeyArrayIndex]) === false ? transformKey[s] : "";
					let commaUnit = textKeyArrayIndex == 0 ? "" : " ,";

					transformText += commaUnit + textKeyArray[textKeyArrayIndex] + unit;
				}
				transformText += ")";

				if(this.elementConfig.animationEvent.keyframe) {
					elmStyle.animation = '';
				}
				elmStyle.transform = transformText;
			} else {
				let cssRoleText = "";
				let textKeyArray = v.split(" ");
				for(let textKeyArrayIndex = 0, textKeyArrayLength = textKeyArray.length; textKeyArrayIndex < textKeyArrayLength; textKeyArrayIndex++) {
					if(textKeyArray[textKeyArrayIndex] != "") {
						let unit = isNaN(textKeyArray[textKeyArrayIndex]) === false ? cssUnitValue[s] !== undefined ? cssUnitValue[s] : "px" : "";
						let space = textKeyArrayIndex+1 < textKeyArrayLength ? " " : "";
						cssRoleText += textKeyArray[textKeyArrayIndex] + unit + space;
					}
				}

				this.elementConfig.targetElement.style[s] = cssRoleText;
			}

			return this;
		});


		_j2eUtil.createFunction("setCallBack", function(f) {

			if(f === "" && typeof f !== "object") {
				console.error("함수 설정이 잘 못 되었습니다.");
				return this;
			}

			this.elementConfig.animationOption.callBack = f;

			return this;
		});


		window.j2e = _j2e.selector;
		window.j2e.addRole = _j2e.addRole;

}(window, document));
