import Foundation

struct Project: Codable, Identifiable, Sendable {
    let id: UUID
    var name: String
    var language: String
    var sourceText: String
    var modifiedAt: Date

    init(
        id: UUID = UUID(),
        name: String,
        language: String,
        sourceText: String,
        modifiedAt: Date = Date()
    ) {
        self.id = id
        self.name = name
        self.language = language
        self.sourceText = sourceText
        self.modifiedAt = modifiedAt
    }
}
