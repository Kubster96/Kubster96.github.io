# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static website for "8 Plus" language school (Szkoła Języków Obcych) in Sanok, Poland. The school teaches English and German, with Cambridge exam preparation (FCE, CAE).

## Technology

- Pure HTML with inline CSS (no build system, no JavaScript framework)
- Character encoding: ISO-8859-2 (Polish encoding)
- Table-based layout (legacy design pattern)
- No package.json, no build tools

## File Structure

- `index.html` - Homepage with announcements, job postings, school info
- `contact.html` - Contact information, phone numbers, locations
- `places.html` - Course offerings, languages, pricing info
- `exams.html` - Cambridge exam results and statistics
- `zasady.html` - GDPR/RODO information and sanitary regulations
- `rules/` - Child protection standards documents
- `images/` - All images (logos, charts, maps, backgrounds)

## Important Notes

- Content is in Polish language
- Files use ISO-8859-2 encoding (not UTF-8) - maintain this encoding when editing
- Images use rollover effects via `onMouseOver`/`onMouseOut` JavaScript
- External script from Cambridge English tools embedded in `exams.html`
- No server-side processing - deploy by copying files to web server