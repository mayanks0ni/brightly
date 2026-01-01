def parse_recap(text: str, year: int, memories: list[dict]):
    def section(name):
        try:
            start = text.index(name) + len(name)
            end = min(
                [text.index(h, start) for h in headers if h in text[start:]] + [len(text)]
            )
            return text[start:end].strip()
        except ValueError:
            return ""

    headers = [
        "THEMES:",
        "PEAK MOMENTS:",
        "NARRATIVE:",
        "PERSONALITY:",
        "CLOSING NOTE:",
    ]

    themes = [
        l.strip("- ").strip()
        for l in section("THEMES:").splitlines()
        if l.strip().startswith("-")
    ]

    peaks = [
        l.strip("- ").strip()
        for l in section("PEAK MOMENTS:").splitlines()
        if l.strip().startswith("-")
    ]

    return {
        "year": year,
        "total_memories": len(memories),
        "themes": themes[:5],
        "peak_moments": peaks[:3],
        "narrative": section("NARRATIVE:"),
        "personality": section("PERSONALITY:"),
        "closing_note": section("CLOSING NOTE:"),
    }
