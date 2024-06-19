# QuickDraw
============

## Description ## 
This macro extension allows you to add hotkeys which lets you forward clipboard data
and concatenate it with predefined Threat Intelligence lookup URLs.

You can add multiple URLs under one "site" if the site allows lookup of different entities.
This allows you to open tabs to all the T.I lookup tools you want in one keypress, from any site e.g. 
your SIEM tool. 

---

## Installation ## 
Not yet published to Chrome store, download the repo and and use Developer Mode under "Extensions" in your browser,
then choose "Load Unpacked".  

Tested on Brave, Edge and Chrome but should work in most modern Chromium based browsers.
---

## Configuration ##
Press Option in the plugin to access the settings.

---

## Pre configured sites ##

| Site                 | Supported entities                                   |
| :------------------- | :----------------------------------------------------|
| AbuseIPDB            | IP                                                   |
| VirusTotal           | IP, Domain, Hash                                     |
| Scamalytics          | IP                                                   |
| AlienVault           | IP, Domain, Hash                                     |
| GreyNoise            | IP, Domain, Hash                                     |
| Shodan               | IP, Domain                                           |
| Tor Project          | IP, domain                                           |
| DomainTools Whois    | IP                                                   |

## Examples ## 

As an example we'll use VirusTotal, which let's a user lookup IP's, domains or filehashes etc.
If you've added a site in Settings and configured a hotkey to use for that site, the extension will
use regex to identify what type of entity you're trying to lookup.

EXAMPLE 1:

Copy "127.0.0.1" to clipboard -> Press hotkey -> Opens tabs for all sites configured to that specific hotkey
which are able to look up the specific entity (an IP address in our case).

---

You can add custom T.I sources such as MISP hosted on a private network which may have query params in the URL and define what part of the URL should be
replaced with the clipboard data on hotkey press.

## Additional functionality ##

I want to add support for API:s and setting timestamps in URI query params down the line as well as adding the ability to add custom
regex patterns for other types of IOCs.
 As of now it supports IP addresses, File hashes and Domains.