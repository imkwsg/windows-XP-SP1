//***********************    Localization variable    *****************
var L_strAlert1_Message = "Please enter the Internal domain name"; 
var L_strAlert2_Message = "Please enter the Internet domain name";
//***********************    Localization variable    *****************

document.onbeforeunload	= reset;
var srvWiz				= new ActiveXObject("ServerAdmin.ConfigureYourServer");

function loadForm()
// --------------------------------------------------------------------------------------
// function performed at page load; load the values stored in oDataStore
// --------------------------------------------------------------------------------------
{
    divMain2.load("oDataStore");    
    var a=divMain2.getAttribute("stxtName1");
    var b=divMain2.getAttribute("stxtName2");
    var c=divMain2.getAttribute("stxtDNSName");
    var d=divMain2.getAttribute("stxtNetBiosName");
    
    // obtain computer name and DNS domain with util.vbs function
    if (a==null) a = getMachineName();
    if (b==null) b = getDNSDomain();
    if (c==null) c = getMachineName()+ "." + getDNSDomain();
    if (d==null) d = getMachineName();
    form.txtName1.value			= a;
    form.txtName2.value			= b;
    form.txtDNSName.value		= c;
    form.txtNetBiosName.value	= d;	
	loadFocus(); // set focus on Next button
}

function matchDNSName()
// --------------------------------------------------------------------------------------
// function used OnKeyUp for Internal domain name input filed; 
// --------------------------------------------------------------------------------------
{
	form.txtDNSName.value		= (form.txtName1.value.length>0)?form.txtName1.value + "."+ form.txtName2.value:"";
	form.txtNetBiosName.value	= form.txtName1.value;
	document.all.L_next_Button.disabled	= false;
}

function matchNetBiosName()
// --------------------------------------------------------------------------------------
// function used OnKeyUp for Internet domain name input filed; 
// --------------------------------------------------------------------------------------
{
	form.txtDNSName.value	= form.txtName1.value + "."+ form.txtName2.value;
	document.all.L_next_Button.disabled	= false;
}

function wait()
// --------------------------------------------------------------------------------------
// function displys a "Please wait" message with a progress indication (.)
// --------------------------------------------------------------------------------------
{
	document.all.L_next_Button.disabled=true;
	divWait.style.display="";
	L_pWait_TEXT.innerHTML	+= ".";
	next();
}

function back()
// --------------------------------------------------------------------------------------
// process when click on BACK button (persist data and load previous server.htm page)
// --------------------------------------------------------------------------------------
{	saveForm(); self.location.href="server.htm"; }

function next()
// --------------------------------------------------------------------------------------
// process when NEXT button clicked ; check entries made and proceed to next page (dc2.htm) 
// --------------------------------------------------------------------------------------
{
	if (CheckDNSName()&&CheckNetBiosName())
		{ saveForm(); self.location.href="dc2.htm"; }
	else
		{ divWait.style.display="none"; document.all.L_next_Button.disabled=false; }
}
	
function CheckDNSName()
// --------------------------------------------------------------------------------------
// function used when NEXT clicked; 
// --------------------------------------------------------------------------------------
{
   if(trimIt(form.txtName1.value)=="")
   {
		showAlert(L_strAlert1_Message);
		form.txtName1.focus();
		return false;
	}
	else if(trimIt(form.txtName2.value)=="")
	{
		showAlert(L_strAlert2_Message);
		form.txtName2.focus();
		return false;
	}
	else
	{
		var varName		= trimIt(form.txtDNSName.value);
		var validate	= srvWiz.ValidateName("DNS", varName)	
    	switch(validate)
    	{
			case 0:
				showAlert(L_strAlert1_Message);
				form.txtDNSName.focus();
				return false;
				break;
			case 1:
				var L_strAlert1FirstPart_Message = 'The domain name "%1" is too long.\r\n\r\nDNS names may contain letters (a-z, A-Z), numbers (0-9), and hyphens, but no spaces. Periods (.) are used to separate domains. Each domain label can be no longer than 63 bytes.';
				var strAlert1MiddlePart = varName;  // not localizable - "varName" is a code variable				
				var strAlert1 = L_strAlert1FirstPart_Message.replace(/%1/g, strAlert1MiddlePart);
				showAlert(strAlert1);
				form.txtDNSName.focus();
				return false;
				break;
			case 2:
				var L_strAlert2FirstPart_Message = 'The syntax of the domain name "%1" is incorrect.\r\n\r\nDNS names may contain letters (a-z, A-Z), numbers (0-9), and hyphens, but no spaces. Periods (.) are used to separate domains. Each domain label can be no longer than 63 bytes. You may not have every label be a number.\r\n\r\nExample: domain-1.microsoft.com.';
				var strAlert2MiddlePart = varName; 
				var strAlert2 = L_strAlert2FirstPart_Message.replace(/%1/g, strAlert2MiddlePart);
				showAlert(strAlert2);
				form.txtDNSName.focus();
				return false;
				break;
			case 3:
				var L_strAlert31Part1_Message = 'The domain name "%1" contains bad characters.';
				var strAlert31MiddlePart = varName; 
				var strAlert31Part2 = L_strAlert31Part1_Message.replace(/%1/g, strAlert31MiddlePart);
				var L_strAlert31Part3_Message = "This name may contain letters (a-z, A-Z), numbers (0-9), and hyphens, but no spaces or periods. Illegal characters include {|}~[\\]^':;<=>?@!";
				var strAlert31Part4 = '"#$%`()+/';
				strAlert =  strAlert31Part2 + L_strAlert31Part3_Message + strAlert31Part4;
				showAlert(strAlert);
				form.txtDNSName.focus();
				return false;
				break;
			case 4:
				var L_strAlert4FirstPart_Message = 'The domain name "%1" is formatted incorrectly.\r\n\r\nDNS names may contain letters (a-z, A-Z), numbers (0-9), and hyphens, but no spaces. Periods (.) are used to separate domains. Each domain label can be no longer than 63 bytes. You may not have every label be a number.\r\n\r\nExample: domain-1.microsoft.com.';
				var strAlert4MiddlePart = varName; 
				var strAlert4 = L_strAlert4FirstPart_Message.replace(/%1/g, strAlert4MiddlePart);				
				showAlert(strAlert4);
				form.txtDNSName.focus();
				return false;
				break;
			case 5:
				var L_strAlert5FirstPart_Message = 'The name "%1" is already in use on this network. Type a name that is not in use.';
				var strAlert5MiddlePart = varName; 
				var strAlert5 = L_strAlert5FirstPart_Message.replace(/%1/g, strAlert5MiddlePart);
				showAlert(strAlert5);
				form.txtDNSName.focus();
				return false;
				break;
			case 6:
				setReg(SZ_DomainDNSName,varName)
				return true;
				break;
			default:
				return false;
				break;
		}
	}
}

function CheckNetBiosName()
// --------------------------------------------------------------------------------------
// function used when NEXT clicked, to validate NetBios name
// --------------------------------------------------------------------------------------
{
    var varName		= trimIt(form.txtNetBiosName.value);
	var validate	= srvWiz.ValidateName("NetBios", varName)
    switch(validate){
		case 0:
				showAlert(L_strAlert1_Message);
				form.txtNetBiosName.focus();
				return false;
				break;
		case 1:
				var L_strAlert1FirstPart2_Message = 'The NetBIOS name "%1" is too long.  The maximum length is 63 bytes.';
				var strAlert1MiddlePart2 = varName; 
				var strAlert1NetBios = L_strAlert1FirstPart2_Message.replace(/%1/g, strAlert1MiddlePart2);
				showAlert(strAlert1NetBios);
				form.txtNetBiosName.focus();
				return false;
				break;
		case 2:
				var L_strAlert2FirstPart2_Message = 'The NetBIOS domain name "%1" is a number.  The name may not be a number.';
				var strAlert2MiddlePart2 = varName; 
				var strAlert2NetBios = L_strAlert2FirstPart2_Message.replace(/%1/g, strAlert2MiddlePart2);
				showAlert(strAlert2NetBios);
				form.txtNetBiosName.focus();
				return false;
				break;
		case 3:
				var L_strAlert3FirstPart2_Message = 'The NetBIOS name contains illegal characters. Illegal characters include "" / \\ [ ] : | < > + = ; , ? and *.';
				showAlert(L_strAlert3FirstPart2_Message);
				form.txtNetBiosName.focus();
				return false;
				break;
		case 4:
				var L_strAlert4FirstPart2_Message = 'The NetBIOS name "%1"is malformed. Type a different name.';
				var strAlert4MiddlePart2 = varName; 
				var strAlert4NetBios = L_strAlert4FirstPart2_Message.replace(/%1/g, strAlert4MiddlePart2);
				showAlert(strAlert4NetBios);
				form.txtNetBiosName.focus();
				return false;
				break;
		case 5:
				var L_strAlert5FirstPart2_Message = 'The NetBIOS name "%1"is already in use. Type a different name.';
				var strAlert5MiddlePart2 = varName; 
				var strAlert5NetBios = L_strAlert5FirstPart2_Message.replace(/%1/g, strAlert5MiddlePart2);
				showAlert(strAlert5NetBios);
				form.txtNetBiosName.focus();
				return false;
				break;
		case 6:
				setReg(SZ_DomainNetBiosName,varName)
				return true;
				break;
		default:
				return false;
				break;
	}
}

function saveForm()
// --------------------------------------------------------------------------------------
// process before exiting the page; saves the selection and entries made
// --------------------------------------------------------------------------------------
{
    var oPersist1=form.txtName1;
    var oPersist2=form.txtName2;
    var oPersist3=form.txtDNSName;
    var oPersist4=form.txtNetBiosName;
    
    divMain2.setAttribute("stxtName1",		oPersist1.value);
    divMain2.setAttribute("stxtName2",		oPersist2.value);
    divMain2.setAttribute("stxtDNSName",	oPersist3.value);
    divMain2.setAttribute("stxtNetBiosName",oPersist4.value);    
    divMain2.save("oDataStore");
}
