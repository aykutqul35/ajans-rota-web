const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboardView.jsx', 'utf8');

const tableEnd = `                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Chat / Ticket Modal */}`;

const tableEndNew = `                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {/* Chat / Ticket Modal */}`;

// Wait, the structure in AdminDashboardView.jsx is a bit different. Let's see the render of the table:
