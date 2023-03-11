const Cards = require('');

const Canvas = require('canvas');
const superagent = require('superagent');

const urlToBuffer = (url=``, size=`512`) => {
	if (!url) return null
	return superagent.get(url.replace(/\?size=2048$/g, `?size=${size}`)).then((res: any) => res.body)
}


class UI {
	/**
	 * LevelUp-Message UI Builder.
	 * to access the buffer, please call `.toBuffer()` after running `(this as any).build()`
	 * @param {User} [user={}] parsed user object from `./src/libs/user`
	 * @param {number} [level=0] new level to be displayed in the card
	 * @return {Canvas}
	 */
	constructor(user={} as any, level=0) {
		(this as any).user = user
		(this as any).level = level
	}

	async build() {
		let card = await new Cards({width: 250, height: 80, theme: (this as any).user.usedTheme.alias})
		//  Base
		card.createBase({cornerRadius: 100})
		//  Add top cover
		await card.addBackgroundLayer((this as any).user.usedCover.alias,{
			isSelfUpload: (this as any).user.usedCover.isSelfUpload, 
			gradient: true,
			gradientHeight: 160
		})
		//  User's avatar on left
		await card.addContent({ 
			avatar: await urlToBuffer((this as any).user.master.displayAvatarURL({extension: `png`, forceStatic: true})),
			avatarRadius: 10,
			marginLeft: 42,
			marginTop: 43,
			inline: true
		})
		//  Main text content
		card.addTitle({ 
			main: `Level up to ${(this as any).level}!`,
			size: 13, 
			fontWeight: `bold`,
			marginLeft: 25,
			marginTop: 46,
			align: `left`,
			inline: true
		})
		//  Finalize
		card.ready()
		return card.canv.toBuffer()
	}
}
						 
						 /**
						  * (this as any) is the default class
						  */
						 
						 const { resolveImage } = require(`canvas-constructor`);
						 const loadAsset = require('');
						 const sizeOfBuffer = require(`buffer-image-size`);
						 const Color = require(`color`);
						 const { DEFAULT, DATABAR, CONTENT } = require('');
						 const palette = '';
						 const themePresets = require('')
						 /**
						  * Universal UI Library for Annie's Material Design.
						  * Supports method chaining.
						  */
						

						 class Card {
							 public width: any;
							 public height: any;
							 public parsingThemeCode: any;
							 public color: any;
							 public canv: any;
							 public marginLeft: any;
							 public marginTop: any;
							 public align: any;
							 public dataBarCount: any;
							 public dataBarSize: any;
							 public reservedSpace: any;
							 public primaryColor: any;
							 public avatar: any;
							 public _getHorizontalAlign: any;
							 public bgWidth: any;
							 public bgHeight: any;
						 
							 /**
							  * Global presets for current card instance.
							  * @param {*} Object
							  */
							 constructor({
								 width=DEFAULT.WIDTH, 
								 height=DEFAULT.HEIGHT, 
								 theme=DEFAULT.THEME, 
								 dataBarSize=DEFAULT.DATABAR.SIZE,
								 primaryColor=themePresets[DEFAULT.THEME].text,
								 marginLeft=50,
								 marginTop=50,
								 align=`left`
								 }) {
								 (this as any).width = width
								 (this as any).height = height
								 (this as any).parsingThemeCode = theme.startsWith(`dark`) ? `dark` : `light`;
								 (this as any).color = themePresets[(this as any).parsingThemeCode]
								 (this as any).canv = new Canvas((this as any).width, (this as any).height) 
								 (this as any).marginLeft = marginLeft as any
								 (this as any).marginTop = marginTop as any
								 (this as any).align = align as any
								 (this as any).dataBarCount = 0 as any
								 (this as any).dataBarSize = dataBarSize
								 (this as any).reservedSpace = 0 as any
								 (this as any).primaryColor = primaryColor
								 (this as any).avatar = {width: 50, height: 50}
								 
							 }
						 
							 getBuffer(){
								 return (this as any).canv.toBuffer()
							 }
						 
							 /**
							  * 	Finisher method chain..
							  * 	@ready
							  */
							 ready() {
								 return (this as any).canv
							 }
							 
						 
							 /**
							  * 	Fallback handler for component's color property.
							  * 	@param {String} prop color's name reference.
							  *	@param {String} defaultOpt fallback color when given prop is not exists in the available palette pool.
							  * 	@private	
							  * 	@_resolveColor
							  */
							 _resolveColor(prop: any, defaultOpt=`white`) {
						 
								 //	Gives default option if the given prop is undefined/null
								 if (!prop) return defaultOpt
								 //	Following system theming
								 if ((this as any).color[prop]) return (this as any).color[prop]
								 //	If color is inherited, (this as any) will use the defined primary color in the global preset.
								 if (prop === `inherit`) return (this as any).primaryColor
								 //	Returns if the given prop is a valid hex code
								 if (prop.startsWith(`#`)) return prop
								 //	Check for color availability in standard colorset
								 if (palette[prop]) return palette[prop]
						 
								 return defaultOpt
							 }
						 
							 /**
							  *  ----------------------------------------------------------------------------------------
							  * 	CARDS COMPONENTS SECTION
							  * ----------------------------------------------------------------------------------------
							  * 
							  */
						 
							 /**
							  *	Initialize canvas with base card layer.
							  *	@param {Hex|ResolvableColor} color custom color choice.
							  *	@param {Integer} cornerRadius integer value for card cornerning radius.
							  *	@createBase
							  */
							 createBase({color=``, cornerRadius=DEFAULT.CORNER_RADIUS}) {
								 const grad = (this as any).canv.createLinearGradient(0, 0,  Math.floor((this as any).width/1.5), 0)
								 const themeInRgb = Color((this as any).color.highlight).rgb().array()
								 const semiTransparent = `rgba(${themeInRgb.join(`,`)},0.2)`
								 grad.addColorStop(1, (this as any).color.highlight)
								 grad.addColorStop(0.5, semiTransparent)
								 grad.addColorStop(0, (this as any).color.main)
								 (this as any).canv
								 .setColor((this as any)._resolveColor(color, (this as any).color.main))
								 .createRoundedClip(10, 10, (this as any).width - 20, (this as any).height - 20, cornerRadius)
								 .printRectangle(0, 0, (this as any).width, (this as any).height)
								 
								 return (this as any)
							 }
						 
							 /**
							  * Return the chosen color palette
							  * @param {String}	theme light or dark 
							  * @returns {Object} preset colors for specified theme
							  */
							 getColorPalette(theme=`light`){
								 if (theme === `light`) return themePresets[`light`]
								 if (theme === `dark`) return themePresets[`dark`]
								 return themePresets[`light`]
							 }
						 
							 /**
							  *  ----------------------------------------------------------------------------------------
							  * 	TYPOGRAPHY COMPONENTS SECTION
							  * ----------------------------------------------------------------------------------------
							  * 
							  */
						 
							 /**
							  * 	Add title section to the card.
							  * 	@param {*} Object 
							  * 	@addTitle
							  */
							 addTitle({
								 main=``,
								 caption=null as any, 
								 align=(this as any).align,
								 inline=false,
								 releaseHook=false,
								 marginTop=(this as any).marginTop,
								 marginLeft=0,
								 size=null as any,
								 captionMargin=15,
								 fontWeight=`light`,
								 captionColor=(this as any).color.caption,
								 color=(this as any).color.text}) {
								 color = (this as any)._resolveColor(color, (this as any).color.text)
								 captionColor = (this as any)._resolveColor(captionColor, (this as any).color.text)
								 (this as any).canv
								 .setColor(color)
								 .setTextAlign(align)
								 .setTextFont(size ? `${parseInt(size as any)}pt roboto-${fontWeight}` : DEFAULT.HEADER.TITLE.FONT)
								 .printText(main, (this as any)._getHorizontalAlign(align)+marginLeft, (this as any).reservedSpace+marginTop)
								 if (caption) {
									 (this as any).canv // @ts-ignore
									 .setTextFont(size ? `${parseInt(size/1.5)}pt roboto-${fontWeight}` : DEFAULT.HEADER.CAPTION.FONT)
									 .setColor(captionColor)
									 .printText(caption, (this as any)._getHorizontalAlign(align)+marginLeft, (this as any).reservedSpace+marginTop+captionMargin)
								 }
								 //	Add state for flexible Y positioning
								 if (!inline || (releaseHook && inline)) {
									 if (caption) (this as any).reservedSpace += captionMargin as any
									 (this as any).reservedSpace += marginTop
								 }
						 
								 return (this as any)
							 }
						 
							 /**
							  *	Add content/body section to the card.
							  *	@param {*} Object 
							  * 	@addContent
							  */
							 async addContent({
								 main=``,
								 caption=null as any,
								 align=(this as any).align,
								 mainColor=(this as any).color.text,
								 captionColor=(this as any).color.caption,
								 fontWeight=`Bold`,
								 size=`small`,
								 justify=null as any,
								 marginTop=(this as any).marginTop,
								 marginLeft=(this as any).marginLeft,
								 marginBottom=0,
								 inline=false,
								 releaseHook=false,
								 captionMargin=20,
								 img=null as any,
								 imgDy=0,
								 imgDx=0,
								 avatar=null as any,
								 avatarRadius=10
								 }) {
								 //	Handle sensitive case
								 if (typeof size === `string`) size = size.toUpperCase()
								 //	Handle custom color selectio
								 mainColor = (this as any)._resolveColor(mainColor, (this as any).color.text)
								 captionColor = (this as any)._resolveColor(captionColor, (this as any).color.caption)
						 
								 const customAvatarRadius = avatarRadius ? avatarRadius : Math.floor((this as any).avatar.width/2)
								 const customAvatarWidth = avatarRadius ? avatarRadius * 2 : (this as any).avatar.width
								 const customAvatarHeight = avatarRadius ? avatarRadius * 2 : (this as any).avatar.height
								 const mainMarginLeft = () => {
									 let combinedCustomXAxis = 0
									 if (justify) combinedCustomXAxis += (this as any)._getHorizontalAlign(justify)
									 /** 
									 *  If avatar parameter is supplied, then the text's X position
									 *  will be sum by avatarRadius value.
									 *  EXAMPLE: 
									 *  avatarRadius = 10
									 *  textX = 50
									 *  w/o Avatar -> 50 = X position = textX
									 *  w/ Avatar -> 60 = X position = textX + avatarRadius 
									 *  (therefore, avatar will be placed on the text's original X position.) 
									 */
									 if (avatar) combinedCustomXAxis += customAvatarWidth + 20
									 return combinedCustomXAxis + marginLeft
								 }
								 const avatarMarginLeft = () => {
									 let combinedCustomXAxis = 0
									 if (justify === `center`) return (this as any)._getHorizontalAlign(`center`)//-customAvatarRadius
									 return combinedCustomXAxis + marginLeft
								 }
						 
								 if (caption) {
									 (this as any).canv
									 .setTextFont(CONTENT.CAPTION.SIZE.LARGE)
									 .setColor(captionColor)
									 .printText(caption, marginLeft, (this as any).reservedSpace+marginTop+captionMargin)
								 }
								 
								 if (avatar) {
									 avatar = await resolveImage(avatar)
									 (this as any).canv.printCircularImage(avatar, avatarMarginLeft(), ((this as any).reservedSpace+marginTop)-3, customAvatarWidth, customAvatarHeight, customAvatarRadius)
								 }
								 if (main) {
									 (this as any).canv
									 .setColor(mainColor)
									 .setTextAlign(align)
									 .setTextFont(CONTENT.MAIN_TEXT.SIZE[size] || `${size}pt roboto-${fontWeight}`)
									 .printText(main, mainMarginLeft(), (this as any).reservedSpace+marginTop)
								 }
						 
								 //	Add state for flexible Y positioning
								 if (!inline || (inline && releaseHook)) {
									 if (caption) (this as any).reservedSpace += captionMargin 
									 if (img) (this as any).reservedSpace += sizeOfBuffer(img).height
									 if (avatar) (this as any).reservedSpace += customAvatarRadius as any
									 (this as any).reservedSpace += marginTop
								 }
								 if (img) {
									 img = await resolveImage(img)
									 (this as any).canv.printImage(img, marginLeft+(this as any)._getHorizontalAlign(justify), (this as any).reservedSpace+marginTop-marginBottom, imgDx, imgDy)
								 }
								 return (this as any)
							 }
						 
							 /**
							  * Fit image into card, proportionally.
							  * @param {buffer|string} img can be a prepared-buffer or image ID
							  * @param {boolean} isSelfUpload set true if source image is from selfupload dir
							  * @param {number} top y position of the image. Optional
							  * @param {number} minHeight specified number will be the minimum height of supplied image
							  * @param {boolean} gradient set true to allows gradient transparency on the image
							  * @return {void}
							  */
							 async addBackgroundLayer(img=``, {
								 isSelfUpload=false,
								 top=0, 
								 minHeight=0,
								 gradient=false,
								 gradientHeight=Math.floor((this as any).height/2)
							 }) {
								 let bg = typeof img === `string` ? await loadAsset(img, {assetsPath:isSelfUpload ? `./src/assets/selfupload` : `./src/assets`}) : img
								 const {
									 width: bgWidth, 
									 height: bgHeight
								 } = sizeOfBuffer(bg)
								 const combinedHeight = bgHeight * ((this as any).width/bgWidth)
								 const dynamic = {
									  height: combinedHeight < minHeight ? minHeight : combinedHeight,
									  width: combinedHeight < minHeight ? (this as any).width + (minHeight-combinedHeight) : (this as any).width
								 }
								 const grad = (this as any).canv.createLinearGradient(0, 0, 0, gradientHeight)
								 const themeInRgb = Color((this as any).color.main).rgb().array()
								 const semiTransparent = (opacity=0) => `rgba(${themeInRgb.join(`,`)}, ${opacity})`
								 grad.addColorStop(1, (this as any).color.main)
								 grad.addColorStop(0.5, semiTransparent(0.9))
								 grad.addColorStop(0, semiTransparent(0.7))
								 if (gradient) {
									 (this as any).canv
									 .setGlobalAlpha(0.5)
									 .printImage(await resolveImage(bg), 0, top, dynamic.width, dynamic.height)
									 .setGlobalAlpha(1)
									 .setColor(grad)
									 .printRectangle(0, 0, (this as any).width, (this as any).height)
								 }
								 else {
									 (this as any).canv.printImage(await resolveImage(bg), 0, top, dynamic.width, dynamic.height)
								 }
							 }
						 }
						 
						 module.exports = {
							Card, urlToBuffer, UI
						} as any;